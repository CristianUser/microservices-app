import { FastifyInstance } from 'fastify';
import fastifyMultipart from 'fastify-multipart';

import { FilesService } from '../../services/Files';

export default (fastify: FastifyInstance, opts: any, done: () => void) => {
  const filesService = new FilesService(opts.config);

  fastify.register(fastifyMultipart, { attachFieldsToBody: true });
  fastify.post('/', (request) => filesService.postFile(request.body));
  fastify.get<any>('/*', (request, reply) => {
    filesService.getFile(request.params['*']).then((res) => res.pipe(reply.raw));
  });

  done();
};
