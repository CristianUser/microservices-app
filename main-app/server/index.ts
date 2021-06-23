import Fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import configs from './config/index';
import routes from './routes';

function registerRoutes(fastify: FastifyInstance) {
  routes(fastify, configs['development']);
}

async function build () {
  const fastify = Fastify({ logger: { prettyPrint: true } });

  await fastify.register(require('fastify-express'));

  registerRoutes(fastify);

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
  .then(fastify => fastify.listen(process.env.PORT || 3001, '::'))
  .catch(console.log)
