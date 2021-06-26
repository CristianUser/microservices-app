import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import fastifyCors from 'fastify-cors';
import { getConfig } from './config/index';
import registerRoutes from './routes';

const config = getConfig();

async function build() {
  const fastify = Fastify({ logger: { prettyPrint: true } });

  fastify.register(fastifyCors);

  registerRoutes(fastify, config);
  fastify.setErrorHandler((errors: any, request: FastifyRequest, reply: FastifyReply) => {
    const { stack, ...error } = errors;
    reply.status(error.status || 500);
    // Log out the error to the console
    console.error(stack);
    return reply.send({
      error: {
        message: errors.message,
        ...error
      }
    });
  });
  return fastify;
}

build()
  .then((fastify) => fastify.listen(config.port || 3001, '::'))
  .catch(console.log);
