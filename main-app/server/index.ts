import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import configs from './config/index';
import Speakers from './services/Speakers';
import routes from './routes';


function registerMiddleware(app: any) {
  const speakers = new Speakers(configs['development']);

  app.use('/', routes({
    speakers,
  }));
}

async function build () {
  const fastify = Fastify({ logger: { prettyPrint: true } });

  await fastify.register(require('fastify-express'));

  registerMiddleware(fastify);

  fastify.setErrorHandler(({ stack, ...error }: any, request: FastifyRequest, reply: FastifyReply) => {
    reply.status(error.status || 500);
    // Log out the error to the console
    console.error(stack);
    return reply.send({
      error
    });
  });
  return fastify;
}

build()
  .then(fastify => fastify.listen(process.env.PORT || 3001, '::'))
  .catch(console.log)