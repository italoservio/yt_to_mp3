import crypto from 'crypto';

export class Context {
    constructor(id) {
        this.id = id ?? crypto.randomBytes(16).toString('hex').toUpperCase();
    }

    logger() {
        return {
            info: (message) => {
                console.log(`INFO - ${this.id} - ${message}`);
            },
            error: (message) => {
                console.error(`ERROR: - ${this.id} - ${message}`);
            },
        };
    }
}
