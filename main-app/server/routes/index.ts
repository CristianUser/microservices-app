import { FastifyInstance } from "fastify";
import itemRoutes from './item';
export default (fastify: FastifyInstance, config: any) => {
  fastify.register(itemRoutes, {
    prefix: '/item',
    config
  })
};
