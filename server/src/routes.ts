import { Router } from 'express';

import apiController from './controllers/apiController';
import userController from './controllers/userController';

const routes = Router();

const Apis = new apiController();
const Users = new userController();

routes.get('/apis/list', Apis.index);
routes.post('/apis/create', Apis.create);

routes.post('/users/create', Users.create);
routes.get('/users/list', Users.index);

export default routes;
