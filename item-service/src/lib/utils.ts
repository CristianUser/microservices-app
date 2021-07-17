import { FastifyInstance, FastifyRequest } from 'fastify';
import CrudService from './Crud';

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

    reply.header('ETag', controller.etag);

    return controller.getItems(request.body, includeRelations);
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
