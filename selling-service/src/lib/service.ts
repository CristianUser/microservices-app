import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import { IConfig } from '../config';
import CrudService from './Crud';
import Customer from '../db/entity/Customer';
import { createCrudRoutes } from './utils';
import OrderService from './Order';
import PosLayoutService from './PosLayout';
import PosSessionService from './PosSession';

export default (config: IConfig) => {
  const log = config.log();
  const orderService = new OrderService(config);
  const posLayoutService = new PosLayoutService(config);
  const customerService = new CrudService<Customer>(config, Customer, ['orders']);
  const posSessionService = new PosSessionService(config);
  const fastify = Fastify();

  fastify.get('/health-check', (request, reply) => {
    const { uptime, memoryUsage, cpuUsage } = process;
    const status = {
      cpuUsage: cpuUsage(),
      memoryUsage: memoryUsage(),
      status: 'ok',
      timestamp: Date.now(),
      uptime: uptime()
    };

    reply.send(status);
  });

  fastify.register(createCrudRoutes, {
    prefix: '/order',
    controller: orderService
  });

  fastify.register(createCrudRoutes, {
    controller: customerService,
    prefix: '/customer'
  });

  fastify.register(createCrudRoutes, {
    controller: posLayoutService,
    prefix: '/pos-layout'
  });

  fastify.register(createCrudRoutes, {
    controller: posSessionService,
    prefix: '/pos-session'
  });

  fastify.setErrorHandler((error: any, request: FastifyRequest, reply: FastifyReply) => {
    reply.status(error.status || 500);
    // Log out the error to the console
    log.error(error);
    return reply.send({
      error: {
        message: error.message
      }
    });
  });

  return fastify;
};
