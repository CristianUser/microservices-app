import fastify, { FastifyReply, FastifyRequest } from 'fastify';
import { AuthService } from './Auth';

const service = fastify();


export default (config: any) => {
  const log = config.log();
  const authService = new AuthService(config);

  service.get('/health-check', function (request, reply) {
    reply.send({ status: 'ok' })
  })

  service.post('/authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    const token = authService.createToken(request.body);

    reply.send(token);
  });

  service.post('/verify', async (request: FastifyRequest, reply: FastifyReply) => {
    const { token }: any = request.body; 
    const digest = authService.validate(token);

    reply.send({digest});
  });

  service.setErrorHandler((error: any, request: FastifyRequest, reply: FastifyReply) => {
    reply.status(error.status || 500);
    // Log out the error to the console
    log.error(error);
    return reply.send({
      error: {
        message: error.message
      }
    });
  });

  return service;
};
