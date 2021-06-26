import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import fastifyMultipart from 'fastify-multipart';
import fastifyCors from 'fastify-cors';
import { IConfig } from '../config';
import { FileService } from './File';
import FsStrategy from './FsStrategy';

export default (config: IConfig) => {
  const log = config.log();
  const fileService = new FileService(config, new FsStrategy(config.uploadDir));
  const fastify = Fastify();

  fastify.register(fastifyCors);
  fastify.register(fastifyMultipart); // , { attachFieldsToBody: true });

  fastify.get('/health-check', (request, reply) => {
    const { uptime, memoryUsage, cpuUsage } = process;
    const status = {
      cpuUsage: cpuUsage(),
      memoryUsage: memoryUsage(),
      status: 'ok',
      timestamp: Date.now(),
      uptime: uptime()
    };

    reply.send(status);
  });

  fastify.post('/', async (request: FastifyRequest) => {
    const data = await request.file();

    return fileService.putFile(data);
  });

  fastify.get('/*', async (request: FastifyRequest, reply: FastifyReply) => {
    const { '*': path }: any = request.params;

    fileService.getFile(path).pipe(reply.raw);
  });

  fastify.delete('/*', async (request: FastifyRequest) => {
    const { '*': path }: any = request.params;

    return fileService.deleteFile(path);
  });

  fastify.setErrorHandler((error: any, request: FastifyRequest, reply: FastifyReply) => {
    reply.status(error.status || 500);
    // Log out the error to the console
    log.error(error);
    return reply.send({
      error: {
        message: error.message
      }
    });
  });

  return fastify;
};
