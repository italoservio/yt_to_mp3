import express from 'express';
import 'express-async-errors';
import {JWTAdapter} from './adapters/jwt.js';
import {YTDLAdapter} from './adapters/ytdl.js';
import {HealthController} from './http/controllers/health-controller.js';
import {VideoController} from './http/controllers/video-controller.js';
import {GetMetadataFromVideo} from './use-cases/get-metadata-from-video.js';
import {StreamAudioFromVideo} from './use-cases/stream-audio-from-video.js';
import {LogMiddleware} from './http/middlewares/log-middleware.js';
import {NotFoundMiddleware} from './http/middlewares/not-found-middleware.js';
import {ErrorFilterMiddleware} from './http/middlewares/error-filter-middleware.js';

const app = express();
app.disable('x-powered-by');
app.use(express.json());
app.use(LogMiddleware.handler);

const jwtAdapter = new JWTAdapter(process.env.JWT_SECRET);
const ytdlAdapter = new YTDLAdapter();

const getMetadataFromVideo = new GetMetadataFromVideo(ytdlAdapter, jwtAdapter);
const streamAudioFromVideo = new StreamAudioFromVideo(ytdlAdapter, jwtAdapter);

const videoController = new VideoController(getMetadataFromVideo, streamAudioFromVideo);
const healthController = new HealthController();

app.get('/api/health', healthController.healthcheck.bind(healthController));
app.get('/api/metadata', videoController.getMetadata.bind(videoController));
app.get('/api/mp3', videoController.streamAudio.bind(videoController));

app.use(NotFoundMiddleware.handler);
app.use(ErrorFilterMiddleware.handler);

process.once('SIGTERM', process.exit);
process.once('SIGINT', process.exit);

const listener = app.listen(process.env.SERVER_PORT ?? 5100, () => {
    console.log(`LISTENING :${listener.address().port}`);
});
