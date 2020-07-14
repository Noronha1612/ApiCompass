import { Request, Response } from 'express';

import knex from '../database/connection';

class apiController {
  async index(request: Request, response: Response) {
    const { page, country, likesType, viewsType, ageType } = request.query;

    if ( typeof likesType === 'object' || typeof viewsType === 'object' || typeof ageType === 'object' ) {
      return;
    }

    let apis;

    if ( country ) {
      if ( likesType ) {
        apis = await knex('apis')
        .select('*')
        .limit(10)
        .offset((Number(page) - 1) * 10)
        .orderBy('likes', likesType)
        .where({ apiCountry: country });
      }
      else if ( viewsType ) {
        apis = await knex('apis')
        .select('*')
        .limit(10)
        .offset((Number(page) - 1) * 10)
        .orderBy('views', viewsType)
        .where({ apiCountry: country });
      }
      else {
        apis = await knex('apis')
        .select('*')
        .limit(10)
        .offset((Number(page) - 1) * 10)
        .where({ apiCountry: country })
        .orderBy('id', ageType);
      }
    }
    else {
      if ( likesType ) {
        apis = await knex('apis')
        .select('*')
        .limit(10)
        .offset((Number(page) - 1) * 10)
        .orderBy('likes', likesType);
      }
      else if ( viewsType ) {
        apis = await knex('apis')
        .select('*')
        .limit(10)
        .offset((Number(page) - 1) * 10)
        .orderBy('views', viewsType);
      }
      else {
        apis = await knex('apis')
        .select('*')
        .limit(10)
        .offset((Number(page) - 1) * 10)
        .orderBy('id', ageType);
      }
    }

    return response.json(apis);
  }

  async getPages(request: Request, response: Response) {
    const { country } = request.query;

    let apis;

    if ( country ) {

      apis = await knex('apis')
      .select('*')
      .where({ apiCountry: country });

    } else {

      apis = await knex('apis')
      .select('*');

    }

    const numberOfApis = apis.length;

    const numberOfPages = Math.ceil(numberOfApis / 10);

    const pages = [];

    for( let i = 1; i <= numberOfPages; i++ ) {
      pages.push(i);
    }

    return response.json({ pages });
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
        documentationUrl,
        apiCountry,
      } = request.body;


      const api = await trx('apis').insert({
        apiName,
        apiCountry,
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

      return response.json({id: api[0], apiName, description, mainUrl, documentationUrl, user_id, views: 0, likes: 0, apiCountry});
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
    try {
      const { api_id } = request.headers;

      const views = await knex('apis').where({ id: api_id }).select('views').first();

      await knex('apis').update({
      views: Number(views.views) + 1
      }).where({ id: api_id });

      return response.json({ api_id: api_id, views: views.views + 1 });
    }
    catch (err) {
      return response.json({error: 'API not found'});
    }
  }

  async incrementLikes(request: Request, response: Response) {
    const { api_id, user_id } = request.headers;

    const trx = await knex.transaction();

    const liked_apis = await trx('users').select('liked_apis').where({ id: user_id }).first();

    if ( !liked_apis ) return response.json({ message: 'User not found'})

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