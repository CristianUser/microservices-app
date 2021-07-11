import { FastifyInstance } from 'fastify';

import itemRoutes from './item';
import fileRoutes from './files';
import sellingRoutes from './selling';
import { IConfig } from '../config';

export default (fastify: FastifyInstance, config: IConfig) => {
  fastify.register(itemRoutes, {
    prefix: '/item',
    config
  });

  fastify.register(fileRoutes, {
    prefix: '/files',
    config
  });

  fastify.register(sellingRoutes, {
    prefix: '/selling',
    config
  });
};
