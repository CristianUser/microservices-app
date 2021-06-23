import { FastifyInstance } from 'fastify'
import { ItemService } from '../../services/Item'

export default function (fastify: FastifyInstance, opts: any, done: () => void) {
  const itemService = new ItemService(opts.config);

  fastify.post('/', (request) => itemService.createItem(request.body))

  done()
}
