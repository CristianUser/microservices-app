import { FastifyInstance } from 'fastify';

import itemRoutes from './item';
import fileRoutes from './files';

export default (fastify: FastifyInstance, config: any) => {
  fastify.register(itemRoutes, {
    prefix: '/item',
    config
  });

  fastify.register(fileRoutes, {
    prefix: '/files',
    config
  });
};
