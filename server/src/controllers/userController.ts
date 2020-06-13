import { Request, Response } from 'express';
import crypto from 'crypto';
import knex from '../database/connection';

class userController {
  async create(request: Request, response: Response) {
    try {
      const {
        name,
        email,
        password,
        confirmPassword,
        country,
      } = request.body;

      if ( password !== confirmPassword ) {
        return response.status(400).json({ message: "The passwords don't matches" });
      }

      const cipher = crypto.createCipher('aes-256-gcm', 'userEncrypt');
      
      const encryptedPass = cipher.update(password, 'utf8', 'hex');

      const userId = crypto.randomBytes(8).toString('hex');

      const data = {
        id: userId,
        name,
        email,
        password: encryptedPass,
        country,
        api_ids: ''
      }

      await knex('users').insert(data);

      return response.json(data);
    } catch (err) {
      console.log (err)
      return response.status(400).json({ message: 'Error while trying create user, probably the user typed something unacceptable' })
    }
  }

  async index(request: Request, response: Response) {
    const { user_id } = request.query;

    const users = user_id ? 
      await knex('users').select(['id', 'name', 'email', 'country', 'api_ids']).where({ id: user_id }).first() :
      await knex('users').select(['id', 'name', 'email', 'country', 'api_ids']);

    return response.json(users)
  }

}

export default userController;