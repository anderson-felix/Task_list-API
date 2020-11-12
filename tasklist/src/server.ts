import express from 'express';
import 'express-async-errors';

import './database/connection';
import routes from './routes';
import errorHandler from './errors/handler';

const server = express();

server.use(express.json());

server.use(routes);

server.use(errorHandler);

server.listen(4000);
