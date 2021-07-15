import { FastifyInstance } from 'fastify';
import ItemForm from '../../forms/item';

export default (fastify: FastifyInstance, opts: any, done: () => void) => {
  const itemForm = new ItemForm(opts.config);

  fastify.get<any>('/item', () => {
    return itemForm.build();
  });

  done();
};
