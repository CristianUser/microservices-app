import { FastifyInstance } from 'fastify';
import { Customer, Order } from '../../interfaces/Selling';
import BasicCrud from '../../services/BasicCrud';
import { createCrudRoutes } from '../utils';

export default (fastify: FastifyInstance, opts: any, done: () => void) => {
  const orderService = new BasicCrud<Order>(opts.config, {
    routePrefix: '/order/',
    serviceName: 'selling-service'
  });

  const customerService = new BasicCrud<Customer>(opts.config, {
    routePrefix: '/customer/',
    serviceName: 'selling-service'
  });

  fastify.register(createCrudRoutes, {
    service: customerService,
    prefix: '/customer'
  });

  fastify.register(createCrudRoutes, {
    service: orderService,
    prefix: '/order'
  });
  done();
};
