import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import { IConfig } from '../config';
import CrudService from './Crud';
import Item from '../db/entity/Item';
import ItemGroup from '../db/entity/ItemGroup';
import { createCrudRoutes } from './utils';
import ItemPrice from '../db/entity/ItemPrice';

export default (config: IConfig) => {
  const log = config.log();
  const itemService = new CrudService<Item>(config, Item, ['itemGroup']);
  const itemGroupService = new CrudService<ItemGroup>(config, ItemGroup);
  const itemPriceService = new CrudService<ItemPrice>(config, ItemPrice);
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
    prefix: '/group',
    controller: itemGroupService
  });

  fastify.register(createCrudRoutes, {
    prefix: '/price',
    controller: itemPriceService
  });

  fastify.register(createCrudRoutes, {
    controller: itemService
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
