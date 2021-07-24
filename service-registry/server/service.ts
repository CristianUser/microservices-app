import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import { IConfig } from '../config';
import { ServiceRegistry } from './lib/ServiceRegistry';

function getRequestIp(request: FastifyRequest): string | undefined {
  return request.socket.remoteAddress?.includes('::')
    ? `[${request.socket.remoteAddress}]`
    : request.socket.remoteAddress;
}

export default (config: IConfig) => {
  const log = config.log();
  const serviceRegistry = new ServiceRegistry(config);
  const fastify = Fastify();

  fastify.get('/health-check', (request, reply) => {
    reply.send({ status: 'ok' });
  });

  fastify.route({
    method: 'PUT',
    url: '/register',
    handler: (request: FastifyRequest, reply: FastifyReply) => {
      const { serviceName, serviceVersion, servicePort }: any = request.body;
      const serviceIp = getRequestIp(request);
      const serviceKey = serviceRegistry.register(
        serviceName,
        serviceVersion,
        serviceIp,
        servicePort
      );

      reply.send({ result: serviceKey });
    }
  });

  fastify.route({
    method: 'DELETE',
    url: '/register/:serviceName/:serviceVersion/:servicePort',
    handler: (request, reply) => {
      const { serviceName, serviceVersion, servicePort }: any = request.params;
      const serviceIp = getRequestIp(request);
      const serviceKey = serviceRegistry.unregister(
        serviceName,
        serviceVersion,
        serviceIp,
        servicePort
      );

      reply.send({ result: serviceKey });
    }
  });

  fastify.route({
    method: 'GET',
    url: '/find/:serviceName/:serviceVersion',
    handler: (request, reply) => {
      const { serviceName, serviceVersion }: any = request.params;
      const foundService = serviceRegistry.get(serviceName, serviceVersion);

      if (!foundService) reply.status(404).send({ result: 'Service not found' });
      reply.send(foundService);
    }
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
