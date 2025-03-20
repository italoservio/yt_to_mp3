import jwt from 'jsonwebtoken';

export class JWTAdapter {
    constructor(secret) {
        this.secret = secret;
    }

    sign(payload) {
        return jwt.sign(payload, this.secret);
    }

    verify(token) {
        return jwt.verify(token, this.secret);
    }
}
