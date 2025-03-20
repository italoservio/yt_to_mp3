export class RuntimeException extends Error {
    constructor(message) {
        super(message);

        if (message.includes('youtube:')) {
            /* 
             * Example:
             * ERROR: [youtube:truncated_id] kPa7bs: Incomplete YouTube ID kPa7bs.
             */
            message = message.split(':').slice(3).join(':').trim();
        }

        this.message = message;
        this.status = 500;
    }

    toJSON() {
        return {
            message: this.message,
            status: this.status,
        };
    }
}
