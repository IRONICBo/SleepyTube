# 如何使用 SleepyTube (MVP)

## 1. 环境依赖

- Python 3.10+
- `ffmpeg`（音频处理）
- `yt-dlp`（下载 YouTube/视频站点音频）

安装示例（macOS）：
```bash
brew install ffmpeg yt-dlp
```

安装示例（Ubuntu/Debian）：
```bash
sudo apt-get update
sudo apt-get install -y ffmpeg
pip install yt-dlp
```

## 2. 启动服务

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

uvicorn main:app --host 0.0.0.0 --port 8000
```

打开浏览器访问：
- http://localhost:8000/ （前端页面）
- http://localhost:8000/docs （FastAPI Swagger API 文档）

## 3. 使用前端页面

1. 在输入框粘贴 YouTube 视频链接
2. 选择预设：
   - **Sleep**：更低音量目标、更强的抑制爆音、默认更慢语速并降低音调
   - **Focus**：更接近日常听觉，仍然有一些保护
   - **Raw**：最少处理
3. 可调参数：
   - 语速：0.5-1.5（小于 1 会让语速更慢）
   - 音调：半音（负数让声音更低）
   - 低通截止：降低刺耳高频（建议 8k-12k）
4. 点击“生成睡眠版音频”，等待处理完成后下载 MP3。

## 4. 直接调用 API

```bash
curl -X POST http://localhost:8000/api/process \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.youtube.com/watch?v=VIDEO_ID",
    "preset": "sleep",
    "speed": 0.9,
    "pitch_semitones": -1,
    "lowpass_hz": 9000
  }'
```

返回 JSON 里会有 `download_url`：
```bash
curl -L -o output.mp3 http://localhost:8000/api/download/<job_id>
```

## 5. 注意事项（MVP 限制）

- 只处理单个视频（`--no-playlist`），不支持列表/频道批量。
- “突然音效”主要靠 **压缩 + 限幅** 抑制，未做精细的声学事件检测（后续可加模型检测笑声/咳嗽/掌声）。
- 处理后的文件会暂存到本机 `/tmp/sleepytube_outputs`，MVP 没有自动清理策略。
