import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import { IConfig } from '../config';
import CrudService from './Crud';
import ItemGroup from '../db/entity/ItemGroup';
import { createCrudRoutes } from './utils';
import ItemBrand from '../db/entity/ItemBrand';
import PriceService from './Price';
import ItemService from './Item';
import itemRouter from './routes/Item';

export default (config: IConfig) => {
  const log = config.log();
  const itemService = new ItemService(config);
  const itemPriceService = new PriceService(config);
  const itemGroupService = new CrudService<ItemGroup>(config, ItemGroup, ['items']);
  const itemBrandService = new CrudService<ItemBrand>(config, ItemBrand, ['items']);
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
    prefix: '/brand',
    controller: itemBrandService
  });

  fastify.register(itemRouter, {
    prefix: '/item',
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
