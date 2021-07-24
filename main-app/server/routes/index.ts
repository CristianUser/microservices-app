import { FastifyInstance } from 'fastify';
import { glob } from 'glob';
import { promisify } from 'util';
import path from 'path';

import { IConfig } from '../config';

const globAsync = promisify(glob);

export default async (fastify: FastifyInstance, config: IConfig) => {
  return globAsync('server/routes/**/index.ts')
    .then((files) => files.filter((file) => file.split('/').length > 3))
    .then((files) =>
      Promise.all(
        files.map(async (file) => {
          const resolvedPath = path.resolve(file);
          const prefix = resolvedPath.replace(__dirname, '').replace('/index.ts', '');

          fastify.register(await import(resolvedPath), {
            prefix,
            config
          });
        })
      )
    );
};
