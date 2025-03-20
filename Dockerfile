FROM node:20.11.1-bookworm-slim
EXPOSE 5100
RUN apt-get update \
    && apt-get install -y \
        curl \
        python3 \
        pipx \
        ffmpeg \
    && apt-get clean \
    && pipx install yt-dlp \
    && pipx ensurepath \
    && mv /root/.local/bin/yt-dlp /usr/local/bin/yt-dlp    
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "start"]
