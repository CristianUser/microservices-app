import { FastifyInstance } from 'fastify';
import BasicCrud from '../services/BasicCrud';

type Options<T> = {
  service: BasicCrud<T>;
};

export function createCrudRoutes<T>(
  fastify: FastifyInstance,
  { service }: Options<T>,
  done: () => void
) {
  fastify.get('/:id', (request: any) => service.getDoc(request.params.id));
  fastify.get('/', () => service.getDocs());
  fastify.post('/', (request: any) => service.createDoc(request.body));
  fastify.put('/:id', (request: any) => service.updateDoc(request.params.id, request.body));
  fastify.delete('/:id', (request: any) => service.getDoc(request.params.id));

  done();
}

export default createCrudRoutes;
