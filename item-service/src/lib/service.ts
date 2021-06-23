import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import { IConfig } from '../config';
import { ItemService } from './Item';

export default (config: IConfig) => {
  const log = config.log();
  const itemService = new ItemService(config);
  const fastify = Fastify();

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
    const result = await itemService.createItem(request.body);

    reply.send(result);
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
