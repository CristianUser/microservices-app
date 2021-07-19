import { FastifyInstance } from 'fastify';
import { ItemPrice } from '../../interfaces/Item';
import BasicCrud from '../../services/BasicCrud';
import ItemService from '../../services/Item';
import { createCrudRoutes } from '../utils';
import createItemRoutes from './item';

export default (fastify: FastifyInstance, opts: any, done: () => void) => {
  const itemService = new ItemService(opts.config);
  const itemGroupService = new BasicCrud<any>(opts.config, {
    routePrefix: '/group/',
    serviceName: 'item-service'
  });
  const itemPriceService = new BasicCrud<ItemPrice>(opts.config, {
    routePrefix: '/price/',
    serviceName: 'item-service'
  });
  const itemBrandService = new BasicCrud<any>(opts.config, {
    routePrefix: '/brand/',
    serviceName: 'item-service'
  });

  fastify.register(createCrudRoutes, {
    service: itemGroupService,
    prefix: '/group'
  });

  fastify.register(createCrudRoutes, {
    service: itemPriceService,
    prefix: '/price'
  });

  fastify.register(createCrudRoutes, {
    service: itemBrandService,
    prefix: '/brand'
  });

  fastify.register(createItemRoutes, {
    service: itemService,
    prefix: '/item'
  });
  done();
};
