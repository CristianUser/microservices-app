import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import { IConfig } from '../config';
import { AuthService } from './Auth';

export default (config: IConfig) => {
  const log = config.log();
  const authService = new AuthService(config);
  const fastify = Fastify();

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

  fastify.post('/authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    const token = authService.createToken(request.body);

    reply.send(token);
  });

  fastify.post('/verify', async (request: FastifyRequest, reply: FastifyReply) => {
    const { token }: any = request.body;
    const digest = authService.validate(token);

    reply.send({ digest });
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
