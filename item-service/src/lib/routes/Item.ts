/* eslint-disable no-param-reassign */
import { FastifyInstance } from 'fastify';
import { In } from 'typeorm';
import ItemService from '../Item';
import { createCrudRoutes, parseJson } from '../utils';

type Options = {
  controller: ItemService;
};

export default function itemRouter(fastify: FastifyInstance, options: Options, done: () => void) {
  fastify.get<any>('/priced', async (request) => {
    const { match } = request.query;

    const whereEntries = Object.entries<any>(parseJson(match) || {});
    const where = whereEntries.reduce((prev: any, [key, value]) => {
      prev[key] = Array.isArray(value) ? In(value) : value;
      return prev;
    }, {});
    return options.controller.getPricedItems(where);
  });

  createCrudRoutes(fastify, options, done);
}
