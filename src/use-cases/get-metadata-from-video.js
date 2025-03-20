import {HttpException} from '../exceptions/http-exception.js';

export class GetMetadataFromVideo {
    TEN_MINUTES_IN_SECONDS = 600;

    constructor(
        ytdlAdapter,
        jwtAdapter,
    ) {
        this.ytdlAdapter = ytdlAdapter;
        this.jwtAdapter = jwtAdapter;
    }

    exec(ctx, url) {
        this.ytdlAdapter.setURL(url);

        let metadata;
        try {
            metadata = this.ytdlAdapter.getVideoMetadata(ctx);
        } catch (err) {
            throw new HttpException(err.message, 500);
        }

        if (metadata.duration > this.TEN_MINUTES_IN_SECONDS) {
            throw new HttpException('Video duration should not exceed 10 minutes', 400);
        }

        const token = this.jwtAdapter.sign({...metadata, url});
        return {...metadata, token};
    }
}
