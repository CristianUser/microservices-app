import { FastifyInstance } from 'fastify';
import { Sale } from '../../interfaces/Sales';
import BasicCrud from '../../services/BasicCrud';
import { createCrudRoutes } from '../utils';

export default (fastify: FastifyInstance, opts: any, done: () => void) => {
  const orderService = new BasicCrud<Sale>(opts.config, {
    routePrefix: '/',
    serviceName: 'selling-service'
  });
  fastify.register(createCrudRoutes, {
    service: orderService,
    prefix: '/order'
  });
  done();
};
