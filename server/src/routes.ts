import { Router } from 'express';

import apiController from './controllers/apiController';

const routes = Router();

const Apis = new apiController();

routes.post('/createApi', Apis.create);

routes.get('/apis', Apis.index);

export default routes;
