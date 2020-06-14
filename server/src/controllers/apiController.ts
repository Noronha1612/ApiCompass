import { Request, Response } from 'express';

import knex from '../database/connection';

class apiController {
  async index(request: Request, response: Response) {
    const apis = await knex('apis').select('*');

    return response.json(apis);
  }

  async create(request: Request, response: Response) {
    try {
      const trx = await knex.transaction();

      const {
        user_id
      } = request.headers;

      const checkUserId = await trx('users').select('*').where({ id: user_id });

      if ( !checkUserId[0] ) return response.status(400).json({ message: 'User ID not found in database' });

      const {
        apiName,
        description,
        mainUrl,
        documentationUrl
      } = request.body;


      const api = await trx('apis').insert({
        apiName,
        description,
        mainUrl,
        documentationUrl,
        user_api_id: user_id,
        views: 0,
        likes: 0
      });

      const apiIds = await trx('users').where({ id: user_id }).select('api_ids');

      const apiIdsArray = apiIds[0].api_ids.split(',').filter( (id: string) => !!id );

      const user = await trx('users')
        .update({
          api_ids: [...apiIdsArray, api[0]].join(',')
        })
        .where({ id: user_id});

      await trx.commit();

      return response.json({id: api[0], apiName, description, mainUrl, documentationUrl, user_id, views: 0, likes: 0});
    }
    catch (err) {
      console.log(err);

      return response.status(400).json({ message: 'An error has ocurred while trying register your api' });
    }
  }

  async delete(request: Request, response: Response) {
    const { api_id } = request.params;

    await knex('apis').delete('*').where({ id: api_id });

    return response.json({ deletedApiId: api_id });
  }

  async incrementViews(request: Request, response: Response) {
    const { api_id } = request.headers;

    const views = await knex('apis').where({ id: api_id }).select('views').first();

    await knex('apis').update({
     views: Number(views.views) + 1
    }).where({ id: api_id });

    return response.json({ api_id: api_id, views: views.views + 1 });
  }

  async incrementLikes(request: Request, response: Response) {
    const { api_id, user_id } = request.headers;

    const trx = await knex.transaction();

    const liked_apis = await trx('users').select('liked_apis').where({ id: user_id }).first();

    const previewLiked: string[] = liked_apis.liked_apis.split(',')

    if ( previewLiked.includes(String(api_id)) ) {
      return response.json({ message: 'User has already liked this api' })
    }

    const newestLiked = [...previewLiked, String(api_id)]
      .filter( item => !!item)
      .join(',')

    await trx('users').where({ id: user_id }).update({
      liked_apis: newestLiked
    });

    const likes = await trx('apis').where({ id: api_id }).select('likes').first();

    await trx('apis').update({
     likes: Number(likes.likes) + 1
    }).where({ id: api_id });

    await trx.commit();

    return response.json({ api_id: api_id, likes: likes.likes + 1, user_likes: newestLiked });
  }
}

export default apiController;