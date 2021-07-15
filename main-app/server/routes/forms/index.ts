import { FastifyInstance } from 'fastify';
import FormComposer from '../../services/FormComposer';

export default (fastify: FastifyInstance, opts: any, done: () => void) => {
  const composer = new FormComposer(opts.config);

  fastify.get<any>('/*', (request) => {
    return composer.buildSchema(request.url);
  });

  done();
};
