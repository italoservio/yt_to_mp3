export class HealthController {
    constructor() {}

    healthcheck(_, res) {
        res.json({status: 'ok'});
    }
}
