import { FastifyInstance, FastifyRequest } from 'fastify';
import { Between } from 'typeorm';
import CrudService from './Crud';

/**
 * Parses Json in a secure way
 *
 * @param {string} string
 * @returns {object}
 */
function parseJson(string: string) {
  try {
    return JSON.parse(string);
  } catch (error) {
    return string;
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
    const result = await controller.getItem(id);

    return result;
  });

  fastify.get('/', async (request: any, reply) => {
    const includeRelations = request.query.populate === 'true';
    const { limit = 10, page = 1, match, range, sortBy } = request.query;
    const pagination =
      parseInt(limit, 10) !== -1
        ? {
            take: limit,
            skip: (page - 1) * limit
          }
        : {};
    const where = parseJson(match);
    const order: any = parseJson(sortBy) || {};
    const rangeEntries = Object.entries<any>(parseJson(range) || {});
    const between = rangeEntries.reduce((prev: any, [key, value]) => {
      // eslint-disable-next-line no-param-reassign
      prev[key] = Between(value[0], value[1]);
      return prev;
    }, {});

    reply.header('ETag', controller.etag);

    const results = await controller.getItems(
      { where, order, ...pagination, ...between },
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
