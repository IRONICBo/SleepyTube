FROM python:3.11-slim

# Install ffmpeg and yt-dlp
RUN apt-get update && apt-get install -y --no-install-recommends ffmpeg ca-certificates curl && rm -rf /var/lib/apt/lists/*
RUN pip install --no-cache-dir yt-dlp

WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . ./

ENV SLEEPYTUBE_OUTPUT_DIR=/tmp/sleepytube_out
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
