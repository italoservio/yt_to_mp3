export class LogMiddleware {
    static handler(req, res, next) {
        const start = Date.now();

        const {method, url} = req;

        res.on('finish', () => {
            console.log(`${method} ${url} - ${res.statusCode} - ${Date.now() - start}ms`);
        });

        next();
    }
}
