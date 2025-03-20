import {HttpException} from '../../exceptions/http-exception.js';
import {Context} from '../context.js';

export class NotFoundMiddleware {
    static handler() {
        throw new HttpException(new Context(), "Not found", 404);
    }
}
