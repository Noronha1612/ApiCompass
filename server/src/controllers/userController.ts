import { Request, Response } from 'express';
import crypto from 'crypto';
import knex from '../database/connection';
import generateToken from '../utils/generateJWT';
import { config } from 'dotenv';

config();

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

      const responseData = await knex('users').select(['email', 'name']);

      const DBEmails = responseData.map( item => item.email);
      const DBNames = responseData.map( item => item.name);

      if ( DBEmails.includes(email) ) {
        return response.json({ logged: false, message: "E-Mail has already been registered", field: 'email' });
      }

      if ( DBNames.includes(name) ) {
        return response.json({ logged: false, message: "Name has already been registered", field: 'name' });
      }

      if ( password !== confirmPassword ) {
        return response.json({ logged: false, message: "The passwords don't matches", field: 'password' });
      }

      const passKey = process.env["PASS_ENCRYPT_KEY"];
  
      if ( passKey === undefined ) return;
  
      const cipher = crypto.createCipher('aes-256-gcm', passKey);
      
      const encryptedPass = cipher.update(password, 'utf8', 'hex');

      const userId = crypto.randomBytes(8).toString('hex');

      const data = {
        id: userId,
        name,
        email,
        password: encryptedPass,
        country,
        api_ids: '',
        liked_apis: ''
      }

      await knex('users').insert(data);

      const token = generateToken({
        id: data.id,
        name: data.name,
        email: data.email,
        api_ids: data.api_ids.split(','),
        liked_apis: data.liked_apis.split(','),
        logged: true,
      })

      return response.json({ logged: true, jwToken: token });
    } catch (err) {
      console.log (err)
      return response.json({ message: 'Error while trying create user, probably the user typed something unacceptable' })
    }
  }

  async login(request: Request, response: Response) {
    const { email, password } = request.body;

    const passKey = process.env["PASS_ENCRYPT_KEY"];

    if ( passKey === undefined ) return;

    const cipher = crypto.createCipher('aes-256-gcm', passKey);
      
    const encryptedPass = cipher.update(password, 'utf8', 'hex');

    const userData = await knex('users').select(['id', 'password', 'email', 'name', 'api_ids', 'liked_apis']).where({ email }).first();

    if ( !userData ) {
      return response.json({ logged: false, message: 'Email not found. Please register' });
    }
    if ( encryptedPass !== userData.password ) {
      return response.json({ logged: false, message: "The password does not match" })
    }

    const token = generateToken({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      api_ids: userData.api_ids.split(','),
      liked_apis: userData.liked_apis.split(','),
      logged: true
    });
    
    return response.json({ logged: true, jwToken: token });
  }

  async index(request: Request, response: Response) {
    const data = request.query.user_id ?
      request.query.user_id : 
      request.query.email;

    let users;

    if ( String(data).includes('@') ) {
      try {
        users = data ? 
          await knex('users').select(['id', 'name', 'email', 'country', 'api_ids', 'liked_apis']).where({ email: data }).first() :
          await knex('users').select(['id', 'name', 'email', 'country', 'api_ids', 'liked_apis']);

        if ( !users ) {
          return response.json({ error: true, message: 'Email not found' });
        }
      }
      catch (err) {
        return response.json({ error: true, message: 'Error while trying search email' });
      }
      
    }
    else {
      try {
        users = data ? 
          await knex('users').select(['id', 'name', 'email', 'country', 'api_ids', 'liked_apis']).where({ id: data }).first() :
          await knex('users').select(['id', 'name', 'email', 'country', 'api_ids', 'liked_apis']);

        if ( !users ) {
          return response.json({ error: true, message: 'ID not found' });
        }
      }
      catch (err) {
        return response.json({ error: true, message: 'Error while trying search ID' });
      }
    }
      

    return response.json({error: false, data: users});
  }
}

export default userController;