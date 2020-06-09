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
    apiName: Joi.string().required().error(new Error('The Api Name is a required field')),
    description: Joi.string().required().error(new Error('The Description is a required field')),
    mainUrl: Joi.string().required().error(new Error('The Main URL is a required field')),
    documentationUrl: Joi.string(),
  }),
  headers: Joi.object({
    user_id: Joi.string().required().error(new Error("Can't find any user_id on headers"))
  }).options({ allowUnknown: true })
}), Apis.create);

routes.delete('/apis/delete/:api_id', Apis.delete);

routes.post('/users/create', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().error(new Error('The Name is a required field')),
    email: Joi.string().email().required().error(new Error('The Email is a required field')),
    password: Joi.string().required().error(new Error('The Password is a required field')),
    country: Joi.string().required().error(new Error('The Country is a required field'))
  }),
}), Users.create);

routes.get('/users/list', Users.index);

export default routes;
