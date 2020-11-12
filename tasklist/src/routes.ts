import { Router } from 'express';

import SessionController from './controllers/SessionController';
import TaskController from './controllers/TaskController';
import UserController from './controllers/UserController';
import authMiddleware from './middlewares/auth';

const routes = Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

//todas rotas abaixo desse middleware precisam estar autenticadas
routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.post('/tasks', TaskController.store);

export default routes;
