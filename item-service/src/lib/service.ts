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

  fastify.get('/:id', async (request: FastifyRequest) => {
    const { id }: any = request.params;
    const result = await itemService.getItem(id);

    return result;
  });

  fastify.get('/', async () => {
    const result = await itemService.getItems();

    return result;
  });

  fastify.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const result = await itemService.createItem(request.body);

    return result;
  });

  fastify.put('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const { id }: any = request.params;
    const result = await itemService.updateItem(id, request.body);

    return result;
  });

  fastify.delete('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const { id }: any = request.params;
    const result = await itemService.deleteItem(id);

    return result;
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
