import { FastifyInstance } from 'fastify';
import FormComposer from '../../services/FormComposer';
import PageComposer from '../../services/PageComposer';

export default (fastify: FastifyInstance, opts: any, done: () => void) => {
  const composer = new FormComposer(opts.config);
  const pagesComposer = new PageComposer(opts.config);

  fastify.get<any>('/', () => pagesComposer.getPages());

  fastify.get<any>('/*.json', (request) => composer.buildSchema(request.url));

  done();
};
