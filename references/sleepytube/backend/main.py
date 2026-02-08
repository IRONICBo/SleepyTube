import math
import re
import shutil
import subprocess
import tempfile
import uuid
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel, Field

APP_NAME = "SleepyTube"

# Basic URL validation: http(s) only. (yt-dlp supports many sites; for MVP we keep it permissive.)
URL_RE = re.compile(r"^https?://", re.IGNORECASE)


def run(cmd: list[str]) -> None:
    """Run a command and raise a helpful error if it fails."""
    try:
        subprocess.run(cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    except subprocess.CalledProcessError as e:
        out = e.stdout.decode("utf-8", errors="ignore") if e.stdout else ""
        raise RuntimeError(f"Command failed: {' '.join(cmd)}\n{out}") from e


class ProcessRequest(BaseModel):
    url: str = Field(..., description="YouTube/video URL")
    preset: str = Field("sleep", description="sleep|focus|raw")
    target_lufs: float = Field(-16.0, description="Normalization target loudness (LUFS)")
    limiter_db: float = Field(-1.5, description="Limiter ceiling (dBFS)")
    speed: float = Field(0.9, description="Playback speed (0.5-1.5). <1 slows speech.")
    pitch_semitones: float = Field(-1.0, description="Pitch shift in semitones (negative lowers tone)")
    lowpass_hz: int = Field(9000, description="Low-pass filter to reduce harsh treble")


class ProcessResponse(BaseModel):
    job_id: str
    download_url: str
    info: dict


def check_bins() -> None:
    for b in ("ffmpeg", "yt-dlp"):
        if shutil.which(b) is None:
            raise RuntimeError(
                f"Missing dependency: {b}. Install it and ensure it's on PATH."
            )


def build_filter(req: ProcessRequest) -> str:
    """Build an ffmpeg audio filter chain for sleep-friendly playback."""

    # Loudness normalization: two-pass is better but slower; for MVP use one-pass.
    # See ffmpeg filter: loudnorm
    # We cap true peak via limiter as well.
    target_i = req.target_lufs
    loudnorm = f"loudnorm=I={target_i}:TP=-2.0:LRA=11"

    # Dynamic range compression + soft-knee compand to tame transients like laughs/applause.
    # compand points: input/output in dB. This curve compresses louder parts more.
    compand = "compand=attacks=0.02:decays=0.25:soft-knee=6:points=-90/-90|-30/-26|-18/-16|-10/-10|0/-6"

    # Hard limiter to prevent sudden blasts.
    alimiter = f"alimiter=limit={req.limiter_db}dB"

    # Low-pass to reduce sharp sibilance/harshness at night.
    lowpass = f"lowpass=f={max(2000, int(req.lowpass_hz))}"

    filters = [loudnorm, compand, alimiter, lowpass]

    # Speed adjustment (atempo). atempo supports 0.5-2.0; if outside, chain it.
    spd = float(req.speed)
    if not (0.5 <= spd <= 1.5):
        raise ValueError("speed must be between 0.5 and 1.5")
    filters.append(f"atempo={spd}")

    # Pitch shift: approximate by changing sample rate then compensating tempo.
    # This keeps overall duration roughly the same.
    semis = float(req.pitch_semitones)
    if semis != 0:
        ratio = 2 ** (semis / 12.0)
        # asetrate multiplies pitch+speed; compensate with atempo to restore speed.
        # We clamp atempo stages to [0.5,2.0]
        filters.append(f"asetrate=sample_rate*{ratio}")
        inv = 1 / ratio
        # Chain atempo if needed
        if inv < 0.5:
            filters.append(f"atempo=0.5")
            filters.append(f"atempo={inv/0.5}")
        elif inv > 2.0:
            filters.append(f"atempo=2.0")
            filters.append(f"atempo={inv/2.0}")
        else:
            filters.append(f"atempo={inv}")
        filters.append("aresample=sample_rate")

    return ",".join(filters)


def download_audio(url: str, workdir: Path) -> Path:
    """Download best available audio using yt-dlp."""
    out_tpl = str(workdir / "input.%(ext)s")
    cmd = [
        "yt-dlp",
        "-f",
        "bestaudio/best",
        "--no-playlist",
        "-o",
        out_tpl,
        url,
    ]
    run(cmd)

    # Find the downloaded file.
    for p in workdir.iterdir():
        if p.name.startswith("input.") and p.is_file():
            return p
    raise RuntimeError("Download succeeded but input file not found.")


def process_audio(input_path: Path, output_path: Path, filter_str: str) -> None:
    cmd = [
        "ffmpeg",
        "-y",
        "-i",
        str(input_path),
        "-vn",
        "-af",
        filter_str,
        "-codec:a",
        "libmp3lame",
        "-q:a",
        "4",
        str(output_path),
    ]
    run(cmd)


app = FastAPI(title=APP_NAME)

# Serve a tiny static front-end (no build step) from ../frontend
FRONTEND_DIR = (Path(__file__).resolve().parent.parent / "frontend")
if FRONTEND_DIR.exists():
    app.mount("/", StaticFiles(directory=str(FRONTEND_DIR), html=True), name="frontend")

# Persist processed outputs under /tmp; in real deployment use object storage.
OUTPUT_ROOT = Path(tempfile.gettempdir()) / "sleepytube_outputs"
OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)


@app.get("/health")
def health():
    return {"ok": True, "app": APP_NAME}


@app.post("/api/process", response_model=ProcessResponse)
def api_process(req: ProcessRequest):
    if not URL_RE.match(req.url):
        raise HTTPException(status_code=400, detail="url must start with http:// or https://")

    try:
        check_bins()
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))

    # Presets override some knobs.
    preset = req.preset.lower()
    if preset == "sleep":
        req.target_lufs = -18.0
        req.limiter_db = -2.0
        req.speed = min(req.speed, 0.95)
        req.pitch_semitones = min(req.pitch_semitones, -1.0)
        req.lowpass_hz = min(req.lowpass_hz, 9000)
    elif preset == "focus":
        req.target_lufs = -16.0
        req.limiter_db = -1.5
        req.speed = max(req.speed, 0.95)
        req.pitch_semitones = 0.0
        req.lowpass_hz = min(req.lowpass_hz, 12000)
    elif preset == "raw":
        # Minimal processing.
        req.target_lufs = -16.0
        req.limiter_db = -1.0
        req.speed = 1.0
        req.pitch_semitones = 0.0
        req.lowpass_hz = 20000
    else:
        raise HTTPException(status_code=400, detail="preset must be one of: sleep, focus, raw")

    try:
        filter_str = build_filter(req)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"bad parameters: {e}")

    job_id = uuid.uuid4().hex
    out_path = OUTPUT_ROOT / f"{job_id}.mp3"

    with tempfile.TemporaryDirectory(prefix="sleepytube_") as td:
        workdir = Path(td)
        try:
            inp = download_audio(req.url, workdir)
            process_audio(inp, out_path, filter_str)
        except Exception as e:
            # Clean up partial outputs
            if out_path.exists():
                out_path.unlink(missing_ok=True)
            raise HTTPException(status_code=500, detail=str(e))

    return ProcessResponse(
        job_id=job_id,
        download_url=f"/api/download/{job_id}",
        info={
            "preset": preset,
            "ffmpeg_filter": filter_str,
            "output": str(out_path),
        },
    )


@app.get("/api/download/{job_id}")
def api_download(job_id: str):
    p = OUTPUT_ROOT / f"{job_id}.mp3"
    if not p.exists():
        raise HTTPException(status_code=404, detail="job not found")
    return FileResponse(
        str(p),
        media_type="audio/mpeg",
        filename=f"sleepytube_{job_id}.mp3",
    )


@app.exception_handler(HTTPException)
def http_exception_handler(request, exc: HTTPException):
    return JSONResponse(status_code=exc.status_code, content={"error": exc.detail})
