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

  fastify.get('/', async (request: any) => {
    const includeRelations = request.query.populate === 'true';
    const result = await controller.getItems(request.body, includeRelations);

    return result;
  });

  fastify.post('/', async (request: FastifyRequest) => {
    const result = await controller.createItem(request.body);

    return result;
  });

  fastify.put('/:id', async (request: FastifyRequest) => {
    const { id }: any = request.params;
    const result = await controller.updateItem(id, request.body);

    return result;
  });

  fastify.delete('/:id', async (request: FastifyRequest) => {
    const { id }: any = request.params;
    const result = await controller.deleteItem(id);

    return result;
  });

  done();
}

export default {
  createCrudRoutes
};
