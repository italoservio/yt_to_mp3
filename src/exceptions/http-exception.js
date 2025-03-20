export class HttpException extends Error {
    constructor(ctx, message, status) {
        super(message);

        this.ctx = ctx;
        this.message = message;
        this.status = status;
    }

    toJSON() {
        return {
            message: this.message,
            status: this.status,
        };
    }
}
