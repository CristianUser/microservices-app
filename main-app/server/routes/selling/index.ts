import { FastifyInstance } from 'fastify';
import { Sale } from '../../interfaces/Sales';
import BasicCrud from '../../services/BasicCrud';

export default (fastify: FastifyInstance, opts: any, done: () => void) => {
  const salesService = new BasicCrud<Sale>(opts.config, {
    routePrefix: '/',
    serviceName: 'selling-service'
  });

  fastify.get('/:id', (request: any) => salesService.getDoc(request.params.id));
  fastify.get('/', () => salesService.getDocs());
  fastify.post('/', (request: any) => salesService.createDoc(request.body));
  fastify.put('/:id', (request: any) => salesService.updateDoc(request.params.id, request.body));
  fastify.delete('/:id', (request: any) => salesService.deleteDoc(request.params.id));

  done();
};
