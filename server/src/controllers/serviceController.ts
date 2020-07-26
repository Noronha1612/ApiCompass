import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import { createDecipher } from 'crypto';

import generateJwt from '../utils/generateJWT';
import sendEmail from '../services/sendMail';

config();
class serviceController {
    async generateToken(request: Request, response: Response) {
        const { payload }: { payload: Object } = request.body;

        const token = generateJwt(payload);

        return response.status(200).json({ token });
    }

    async resendEmail(request: Request, response: Response) {
        try {
            const { lsToken } = request.body;

            const tokenKey = process.env.TOKEN_SECRET_KEY as string;

            const encryptKey = process.env.PASS_ENCRYPT_KEY as string;

            const payload = jwt.verify(lsToken, tokenKey) as { userEmail: string, authCode: string };

            const decipher = createDecipher('aes-256-gcm', encryptKey);

            const decryptedCode = decipher.update(payload.authCode, 'hex', 'utf8');

            const authCode = decryptedCode.split('').map( char => parseInt(char) );

            sendEmail({ userEmail: payload.userEmail, authCode });

            return response.status(200).json({ error: false });
        }
        catch(err) {
            return response.status(500).json({ error: true, message: 'Internal Server Error' });
        }
    }
}

export default serviceController;