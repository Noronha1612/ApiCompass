import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();

export default (payload: {}) => {
  const secretKey = process.env['TOKEN_SECRET_KEY'];

  if ( secretKey === undefined ) return;

  const token = jwt.sign(payload, secretKey, {
    algorithm: 'HS256',
    issuer: 'API Compass'
  });

  return token;
}