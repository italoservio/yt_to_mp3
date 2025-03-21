# YT to MP3 Converter
A server who receives Youtube URLs, download it contents, extract the audio and returns a MP3 stream.


## How to use:
### 0. Start server:
```sh
npm run docker:start
```

### 1. Send a Youtube URL with the format `www.youtube.com/watch?v=*`:
```
GET /api/metadata?url=https://www.youtube.com/watch?v=kPa7bsKwL-c
```
```json
{
    "title": "Lady Gaga, Bruno Mars - Die With A Smile (Official Music Video)",
    "duration": "252",
    "thumbnail": "https://i.ytimg.com/vi/kPa7bsKwL-c/maxresdefault.jpg",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Use the token to get the mp3 audio stream:
```
GET /api/mp3?metadata=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Running tests:
```sh
npm run test:e2e
```
```md
# should get video metadata when URL is valid
ok 1 - should get video metadata when URL is valid

# should get mp3 audio stream when URL and metadata are valid
ok 2 - should get mp3 audio stream when URL and metadata are valid

# should not allow videos with duration greater than 10 minutes
ok 3 - should not allow videos with duration greater than 10 minutes

# should throw error when URL is not provided
ok 4 - should throw error when URL is not provided

# should throw error when URL is not a valid Youtube video URL
ok 5 - should throw error when URL is not a valid Youtube video URL

# should throw error when yt-dlp fails
ok 6 - should throw error when yt-dlp fails

# should throw error when metadata is invalid
ok 7 - should throw error when metadata is invalid

1..7
# tests 7
# suites 0
# pass 6
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 14503.547759
```
