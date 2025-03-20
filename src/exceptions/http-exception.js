export class HttpException extends Error {
    constructor(message, status) {
        super(message);

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
