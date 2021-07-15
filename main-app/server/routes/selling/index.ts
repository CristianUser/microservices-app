import { FastifyInstance } from 'fastify';
import { Customer, Order } from '../../interfaces/Selling';
import BasicCrud from '../../services/BasicCrud';
import { createCrudRoutes } from '../utils';

export default (fastify: FastifyInstance, opts: any, done: () => void) => {
  const orderService = new BasicCrud<Order>(opts.config, {
    routePrefix: '/',
    serviceName: 'selling-service'
  });

  const customerService = new BasicCrud<Customer>(opts.config, {
    routePrefix: '/customer/',
    serviceName: 'selling-service'
  });

  fastify.register(createCrudRoutes, {
    service: customerService,
    prefix: '/customer'
  });

  fastify.get('/:id', (request: any) => orderService.getDoc(request.params.id, request.query));
  fastify.get('/', (request) => orderService.getDocs(request.query));
  fastify.post('/', (request: any) => orderService.createDoc(request.body));
  fastify.put('/:id', (request: any) => orderService.updateDoc(request.params.id, request.body));
  fastify.delete('/:id', (request: any) => orderService.deleteDoc(request.params.id));

  done();
};
