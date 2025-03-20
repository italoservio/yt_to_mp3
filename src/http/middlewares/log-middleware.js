import {Context} from '../context.js';

export class LogMiddleware {
    static handler(req, res, next) {
        const start = Date.now();

        const {method, url} = req;
        req.ctx = new Context();

        res.once('close', () => {
            req.ctx.logger().info(`${method} ${url} - ${res.statusCode} - ${Date.now() - start}ms`);
        });

        next();
    }
}
