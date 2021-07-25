import { FastifyInstance } from 'fastify';
import { Customer, Order } from '../../interfaces/Selling';
import BasicCrud from '../../services/BasicCrud';
import { createCrudRoutes } from '../utils';

const serviceName = 'selling-service';

export default (fastify: FastifyInstance, opts: any, done: () => void) => {
  const orderService = new BasicCrud<Order>(opts.config, {
    routePrefix: '/order/',
    serviceName
  });

  const customerService = new BasicCrud<Customer>(opts.config, {
    routePrefix: '/customer/',
    serviceName
  });

  const posLayoutService = new BasicCrud<Customer>(opts.config, {
    routePrefix: '/pos-layout',
    serviceName
  });

  fastify.register(createCrudRoutes, {
    service: customerService,
    prefix: '/customer'
  });

  fastify.register(createCrudRoutes, {
    service: orderService,
    prefix: '/order'
  });

  fastify.register(createCrudRoutes, {
    service: posLayoutService,
    prefix: '/pos-layout'
  });
  done();
};
