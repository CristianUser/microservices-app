import { FastifyInstance } from 'fastify';
import BasicCrud from '../../services/BasicCrud';
import { ItemService } from '../../services/Item';
import { createCrudRoutes } from '../utils';

export default (fastify: FastifyInstance, opts: any, done: () => void) => {
  const itemService = new ItemService(opts.config);
  const itemGroupService = new BasicCrud<any>(opts.config, {
    routePrefix: '/group/',
    serviceName: 'item-service'
  });

  fastify.register(createCrudRoutes, {
    service: itemGroupService,
    prefix: '/group'
  });
  fastify.get('/:id', (request: any) => itemService.getDoc(request.params.id));
  fastify.get('/', () => itemService.getDocs());
  fastify.post('/', (request: any) => itemService.createDoc(request.body));
  fastify.put('/:id', (request: any) => itemService.updateDoc(request.params.id, request.body));
  fastify.delete('/:id', (request: any) => itemService.deleteDoc(request.params.id));

  done();
};
