import { FastifyInstance } from 'fastify';
import { ItemService } from '../../services/Item';

export default (fastify: FastifyInstance, opts: any, done: () => void) => {
  const itemService = new ItemService(opts.config);

  fastify.get('/:id', (request: any) => itemService.getItem(request.params.id));
  fastify.get('/', () => itemService.getItems());
  fastify.post('/', (request) => itemService.createItem(request.body));
  fastify.put('/:id', (request: any) => itemService.updateItem(request.params.id, request.body));
  fastify.delete('/:id', (request: any) => itemService.getItem(request.params.id));

  done();
};
