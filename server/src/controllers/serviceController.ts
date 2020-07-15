import { Request, Response } from 'express';

import generateJwt from '../utils/generateJWT';

class serviceController {
    async generateToken(request: Request, response: Response) {
        const { payload }: { payload: Object } = request.body;

        const token = generateJwt(payload);

        return response.status(200).json({ token });
    }
}

export default serviceController;