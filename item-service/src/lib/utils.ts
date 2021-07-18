/* eslint-disable no-param-reassign */
import { FastifyInstance, FastifyRequest } from 'fastify';
import { Between, ILike, In } from 'typeorm';
import CrudService from './Crud';

/**
 * Parses Json in a secure way
 *
 * @param {string} str
 * @returns {object}
 */
export function parseJson(str: string) {
  try {
    return JSON.parse(str);
  } catch (error) {
    return str;
  }
}

type Options<T> = {
  controller: CrudService<T>;
};
export function createCrudRoutes<T>(
  fastify: FastifyInstance,
  { controller }: Options<T>,
  done: () => void
) {
  fastify.get('/:id', async (request: FastifyRequest) => {
    const { id }: any = request.params;
    return controller.getItem(id);
  });

  fastify.get('/', async (request: any, reply) => {
    const includeRelations = request.query.populate === 'true';
    const { limit: limitArg = 10, page = 1, match, range, sortBy, search } = request.query;
    const limit = parseInt(limitArg, 10);
    const pagination =
      limit !== -1
        ? {
            take: limit,
            skip: (page - 1) * limit
          }
        : {};
    const whereEntries = Object.entries<any>(parseJson(match) || {});
    const where = whereEntries.reduce((prev: any, [key, value]) => {
      prev[key] = Array.isArray(value) ? In(value) : value;
      return prev;
    }, {});
    const order: any = parseJson(sortBy) || {};
    const searchEntries = Object.entries<any>(parseJson(search) || {});
    const like = searchEntries.reduce((prev: any, [key, value]) => {
      prev[key] = ILike(`%${value}%`);
      return prev;
    }, {});
    const rangeEntries = Object.entries<any>(parseJson(range) || {});
    const between = rangeEntries.reduce((prev: any, [key, value]) => {
      prev[key] = Between(value[0], value[1]);
      return prev;
    }, {});

    reply.header('ETag', controller.etag);

    const results = await controller.getItems(
      { where: { ...between, ...where, ...like }, order, ...pagination },
      includeRelations
    );

    return { limit, page, ...results };
  });

  fastify.post('/', async (request: FastifyRequest) => {
    return controller.createItem(request.body);
  });

  fastify.put('/:id', async (request: FastifyRequest) => {
    const { id }: any = request.params;

    return controller.updateItem(id, request.body);
  });

  fastify.delete('/:id', async (request) => {
    const { id }: any = request.params;

    return controller.deleteItem(id);
  });

  done();
}

export default {
  createCrudRoutes
};
