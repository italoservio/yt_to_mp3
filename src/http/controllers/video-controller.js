import {HttpException} from '../../exceptions/http-exception.js';
import {Context} from '../context.js';

export class VideoController {
    constructor(
        getMetadataFromVideo,
        streamAudioFromVideo,
    ) {
        this.getMetadataFromVideo = getMetadataFromVideo;
        this.streamAudioFromVideo = streamAudioFromVideo;
    }

    getMetadata(req, res) {
        const ctx = new Context();
        const url = req.query.url;

        if (!url) {
            throw new HttpException(ctx, 'URL query parameter is required', 400);
        }

        if (!url.includes('youtube.com/watch?v=')) {
            throw new HttpException(ctx, 'A valid Youtube video URL is expected', 400);
        }

        const metadata = this.getMetadataFromVideo.exec(ctx, url);
        res.json(metadata);
    }

    streamAudio(req, res) {
        const ctx = new Context();
        const token = req.query.metadata;

        if (!token) {
            throw new HttpException(ctx, 'Metadata query parameter is required', 400);
        }

        const [stderr, stdout] = this.streamAudioFromVideo.exec(ctx, token);

        stderr.on('data', (error) => {
            console.error('Prematurely ending response stream:', error.toString());
            res.end();
        });

        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Content-Disposition', `attachment; filename='${token.title}.mp3'`);
        stdout.pipe(res);
    }
}
