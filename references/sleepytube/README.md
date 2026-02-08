# SleepyTube

把 YouTube/视频链接处理成“适合睡前听”的音频：
- 统一音量（loudness normalization）
- 压缩动态范围 & 限幅（减少突然爆音：笑声、掌声、咳嗽、音效）
- 轻度削高频（减少刺耳）
- 可选降速/降音调（语速过快、声调过高）

这是一个 **MVP Web App**：FastAPI 后端 + 静态前端，无需前端构建。

- 产品设计文档：[`docs/product.md`](docs/product.md)
- 使用说明：[`USAGE.md`](USAGE.md)

## Quick Start

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# 需要本机安装：ffmpeg, yt-dlp
uvicorn main:app --reload --port 8000
```

浏览器打开：`http://localhost:8000/`
