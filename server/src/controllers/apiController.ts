import { Request, Response } from 'express';

import knex from '../database/connection';

class apiController {
  async index(request: Request, response: Response) {
    const apis = await knex('apis').select('*');

    return response.json(apis);
  }

  async create(request: Request, response: Response) {
    try {
      const {
        apiName,
        description,
        mainUrl,
        documentationUrl
      } = request.body;

      const api = await knex('apis').insert({
        apiName,
        description,
        mainUrl,
        documentationUrl
      });

      return response.json({id: api[0], apiName, description, mainUrl, documentationUrl});
    }
    catch (err) {
      console.log(err);

      return response.status(400).json({ message: 'An error has ocurred while trying register your api' });
    }
  }
}

export default apiController;