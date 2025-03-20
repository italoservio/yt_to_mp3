import {HttpException} from '../../exceptions/http-exception.js';

export class ErrorFilterMiddleware {
    static handler(err, _req, res, _next) {
        console.log('ErrorFilterMiddleware', err);

        res.removeHeader('Content-Disposition');
        res.removeHeader('Content-Type');

        if (err instanceof HttpException) {
            err.ctx.logger().error(err.message);
            return res.status(err.status).json(err.toJSON());
        }

        res.status(500).json({
            code: 500,
            message: err.message ?? "Internal server error"
        });
    }
}
