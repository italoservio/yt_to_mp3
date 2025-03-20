import {HttpException} from '../exceptions/http-exception.js';

export class StreamAudioFromVideo {
    constructor(
        ytdlAdapter,
        jwtAdapter,
    ) {
        this.ytdlAdapter = ytdlAdapter;
        this.jwtAdapter = jwtAdapter;
    }

    exec(ctx, token) {
        let url;
        try {
            const metadata = this.jwtAdapter.verify(token);
            url = metadata.url;
        } catch (err) {
            throw new HttpException('Invalid token', 400);
        }

        this.ytdlAdapter.setURL(url);
        return this.ytdlAdapter.getAudioStream(ctx);
    }
}
