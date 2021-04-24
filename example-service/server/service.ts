import fastify, { FastifyReply, FastifyRequest } from "fastify";

const service = fastify();

const Speakers = require('./lib/Speakers');

module.exports = (config: any) => {
  const log = config.log();

  const speakers = new Speakers(config.data.speakers);

  // Add a request logging middleware in development mode
  // if (service.get('env') === 'development') {
  //   service.use((req, res, next) => {
  //     log.debug(`${req.method}: ${req.url}`);
  //     return next();
  //   });
  // }

  service.get('/list', async (request: FastifyRequest, reply: FastifyReply) => {
    return speakers.getList();
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
