import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import apiController from './controllers/apiController';
import userController from './controllers/userController';

const routes = Router();

const Apis = new apiController();
const Users = new userController();

routes.get('/apis/list', Apis.index);

routes.post('/apis/create', celebrate({
  body: Joi.object().keys({
    apiName: Joi.string().required(),
    description: Joi.string().required(),
    mainUrl: Joi.string().required(),
    documentationUrl: Joi.string(),
  }),
  headers: Joi.object({
    user_id: Joi.string().required()
  }).options({ allowUnknown: true })
}, {
  abortEarly: true
}), Apis.create);

routes.post('/users/create', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    country: Joi.string().required()
  }),
}, {
  abortEarly: true
}), Users.create);

routes.get('/users/list', Users.index);

export default routes;
