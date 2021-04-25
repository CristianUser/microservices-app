import fastify, { FastifyReply, FastifyRequest } from 'fastify';
import { ServiceRegistry } from './lib/ServiceRegistry';

const service = fastify({ logger: { prettyPrint: true } });

module.exports = (config: any) => {
  const log = config.log();
  const serviceRegistry = new ServiceRegistry(log);

  service.get('/health-check', function (request, reply) {
    reply.send({ status: 'ok' })
  })

  service.route({
    method: 'PUT',
    url: '/register',
    handler: (request: FastifyRequest, reply: FastifyReply) => {
      const { serviceName, serviceVersion, servicePort }: any = request.body;

      const serviceIp = request.connection.remoteAddress?.includes('::')
        ? `[${request.connection.remoteAddress}]`
        : request.connection.remoteAddress;

      const serviceKey = serviceRegistry.register(
        serviceName,
        serviceVersion,
        serviceIp,
        servicePort
      );
      reply.send({ result: serviceKey });
    }
  });

  service.route({
    method: 'DELETE',
    url: '/register/:serviceName/:serviceVersion/:servicePort',
    handler: (request, reply) => {
      const { serviceName, serviceVersion, servicePort }: any = request.params;
      const serviceIp = request.connection.remoteAddress?.includes('::')
        ? `[${request.connection.remoteAddress}]`
        : request.connection.remoteAddress;
      const serviceKey = serviceRegistry.unregister(
        serviceName,
        serviceVersion,
        serviceIp,
        servicePort
      );
      reply.send({ result: serviceKey });
    }
  });

  service.route({
    method: 'GET',
    url: '/find/:serviceName/:serviceVersion',
    handler: (request, reply) => {
      const { serviceName, serviceVersion }: any = request.params;
      const foundService = serviceRegistry.get(serviceName, serviceVersion);

      if (!foundService) reply.status(404).send({ result: 'Service not found' });
      reply.send(foundService);
    }
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
