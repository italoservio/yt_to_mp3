import cp from 'node:child_process';
import {RuntimeException} from '../exceptions/runtime-exception.js';

export class YTDLAdapter {
    constructor() {}

    setURL(url) {
        this.url = url;
    }

    getVideoMetadata(ctx) {
        const args = [
            '--print', 'title',
            '--print', 'duration',
            '--print', 'thumbnail',
            this.url
        ];

        ctx.logger().info(`CMD: yt-dlp ${args.join(' ')}`);

        const cmd = cp.spawnSync('yt-dlp', args, {timeout: 20000});

        if (cmd.stderr?.length) {
            throw new RuntimeException(cmd.stderr.toString());
        }

        const [
            title,
            duration,
            thumbnail,
        ] = cmd.stdout.toString().trim().split('\n');

        return {title, duration, thumbnail};
    }

    getAudioStream(ctx) {
        const args = [
            '--quiet',
            '--no-warnings',
            '-f', 'wa',
            '--extract-audio',
            '--audio-format', 'mp3',
            '--output', '-',
            this.url
        ];

        ctx.logger().info(`CMD: yt-dlp ${args.join(' ')}`);

        const cmd = cp.spawn('yt-dlp', args, {timeout: 20000});

        return [cmd.stderr, cmd.stdout];
    }
}
