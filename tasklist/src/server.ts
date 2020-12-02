import express from 'express';
import 'express-async-errors';
import cors from 'cors';

import './database/connection';
import routes from './routes';
import errorHandler from './errors/handler';

const server = express();

server.use(cors()); // TODOS SERVER.USE VÃO FICAR NO ARQUIVO APP.TS EM MIDDLEWARES

server.use(express.json());

server.use(routes);

server.use(errorHandler);

server.listen(4000);
