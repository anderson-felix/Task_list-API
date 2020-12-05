import express from 'express';
import cors from 'cors';
import 'express-async-errors';

import './database/connection';
import routes from './routes';
import errorHandler from './errors/handler';
import server from './server';

class App {
  server: typeof server;

  constructor() {
    this.server;
    this.middlewares();
    this.routes();
  }

  middlewares() {
    server.use(cors());
    server.use(express.json());
    server.use(errorHandler);
  }

  routes() {
    server.use(routes);
  }
}

export default new App();
