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

  async indexByIds(request: Request, response: Response) {
    const { api_ids } = request.headers;

    if ( typeof api_ids !== 'string' ) {
      return response.status(400).json({ error: 'Bad Request from typeof api_ids' });
    }

    const apiIdsArray = api_ids.split(',').map(e => parseInt(e));

    if ( api_ids.length !== (apiIdsArray.length * 2) - 1) {
      return response.status(406).json({ error: 'Bad format from api_ids', api_ids })
    }

    const apisPromisse = apiIdsArray.map(async api_id => {
      const api = await knex('apis')
        .select('*')
        .where({ id: api_id })
        .first();

      return api;
    });

    const apis = await Promise.all(apisPromisse);

    const cleanApis = apis.filter(e => !!e);

    return response.status(200).json({ error: false, data: cleanApis });
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

      await trx('users')
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
      const trx = await knex.transaction();

      const { api_id } = request.headers;

      const apiData = await trx('apis').where({ id: api_id }).select(['views', 'user_api_id']).first<{ views: number, user_api_id: string }>();

      const { score } = await trx('users').where({ id: apiData.user_api_id }).select('score').first<{ score: number }>();

      await trx('apis').update({
      views: Number(apiData.views) + 1
      }).where({ id: api_id });

      await trx('users').where({ id: apiData.user_api_id }).update({ score: score + 1 });

      await trx.commit();

      return response.json({ api_id: api_id, views: apiData.views + 1 });
    }
    catch (err) {
      console.log(err);

      return response.json({error: 'API not found'});
    }
  }

  async incrementLikes(request: Request, response: Response) {
    const { api_id, user_id } = request.headers;

    const trx = await knex.transaction();

    const userData = await trx('users').select(['liked_apis', 'score']).where({ id: user_id }).first<{ liked_apis: string, score: number }>();

    if ( !userData ) return response.json({ message: 'User not found'})

    const previewLiked: string[] = userData.liked_apis.split(',')

    if ( previewLiked.includes(String(api_id)) ) {
      return response.json({ message: 'User has already liked this api' })
    }

    const newestLiked = [...previewLiked, String(api_id)]
      .filter( item => !!item)
      .join(',')

    await trx('users').where({ id: user_id }).update({
      liked_apis: newestLiked
    });

    const apiData = await trx('apis').where({ id: api_id }).select(['likes', 'user_api_id']).first<{ likes: number, user_api_id: string }>();

    await trx('apis').update({
     likes: Number(apiData.likes) + 1
    }).where({ id: api_id });

    await trx('users').where({ id: apiData.user_api_id })
      .update({ score: userData.score + 3 });

    await trx.commit();

    return response.json({ api_id: api_id, likes: apiData.likes + 1, user_likes: newestLiked });
  }

  async decrementLikes(request: Request, response: Response) {
    const { api_id, user_id } = request.headers as { api_id: string, user_id: string };

    const trx = await knex.transaction();

    const userData = await trx('users')
      .select(['liked_apis', 'score'])
      .where({ id: user_id })
      .first<{ liked_apis: string, score: number }>();

    if ( !userData ) return response.status(400).json({ error: true, statusCode: 400, message: 'User not found' });

    const userLikedApis: string[] = userData.liked_apis.split(',');

    if ( !userLikedApis.includes(api_id) ) return response.status(405).json({ error: true, statusCode: 405, message: 'User has not liked this api' });

    const newUserLikedApis = userLikedApis.filter( liked_api_id => liked_api_id !== String(api_id) );

    const { likes: previewLikes, user_api_id } = await trx('apis')
      .select(['likes', 'user_api_id'])
      .where({ id: api_id })
      .first<{ likes: number, user_api_id: string }>();

    await trx('apis')
      .update({ likes: previewLikes - 1 })
      .where({ id: api_id });

    await trx('users')
      .update({ liked_apis: newUserLikedApis.join(',') })
      .where({ id: user_id });

    await trx('users')
      .update({ score: userData.score - 3 })
      .where({ id: user_api_id });

    trx.commit();

    return response.status(200).json({ error: false, api_id, user_id });
  }
}

export default apiController;