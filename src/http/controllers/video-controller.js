import {HttpException} from '../../exceptions/http-exception.js';

export class VideoController {
    constructor(
        getMetadataFromVideo,
        streamAudioFromVideo,
    ) {
        this.getMetadataFromVideo = getMetadataFromVideo;
        this.streamAudioFromVideo = streamAudioFromVideo;
    }

    getMetadata(req, res) {
        const url = req.query.url;

        if (!url) {
            throw new HttpException('URL query parameter is required', 400);
        }

        if (!url.includes('youtube.com/watch?v=')) {
            throw new HttpException('A valid Youtube video URL is expected', 400);
        }

        const metadata = this.getMetadataFromVideo.exec(req.ctx, url);
        res.json(metadata);
    }

    streamAudio(req, res) {
        const token = req.query.metadata;

        if (!token) {
            throw new HttpException('Metadata query parameter is required', 400);
        }

        const [stderr, stdout] = this.streamAudioFromVideo.exec(req.ctx, token);

        stderr.on('data', (error) => {
            req.ctx.logger().error('Prematurely ending response stream:', error.toString());
            res.end();
        });

        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Content-Disposition', `attachment; filename='${token.title}.mp3'`);
        stdout.pipe(res);
    }
}
