import { FastifyInstance } from 'fastify';
import ItemService from '../../services/Item';
import { createCrudRoutes } from '../utils';

type Options = {
  service: ItemService;
};

export default function createItemRoutes(
  fastify: FastifyInstance,
  options: Options,
  done: () => void
) {
  fastify.get('/priced', (request) => options.service.getPricedItems(request.query));

  createCrudRoutes(fastify, options, done);
}
