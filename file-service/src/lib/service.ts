import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import { IConfig } from '../config';
import { FileService } from './File';
import { FsStrategy } from './FsStrategy';
import fastifyMultipart from 'fastify-multipart';


export default (config: IConfig) => {
  const log = config.log();
  const fileService = new FileService(config, new FsStrategy(config.uploadDir));
  const fastify = Fastify();

  fastify.register(fastifyMultipart);

  fastify.get('/health-check', function (request, reply) {
    const { uptime, memoryUsage, cpuUsage } = process;
    const status = {
      cpuUsage: cpuUsage(),
      memoryUsage: memoryUsage(),
      status: 'ok',
      timestamp: Date.now(),
      uptime: uptime()
    };

    reply.send(status);
  })

  fastify.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const data = await request.file();
    const result = await fileService.putFile(data, request.body);

    return result;
  });

  fastify.get('/*', async (request: FastifyRequest, reply: FastifyReply) => {
    const { '*': path }: any = request.params;

    fileService.getFile(path).pipe(reply.raw)
  });

  fastify.delete('/*', async (request: FastifyRequest) => {
    const { '*': path }: any = request.params;

    return fileService.deleteFile(path)
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
