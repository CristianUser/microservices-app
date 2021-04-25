#!/usr/bin/env node

const config = require('../config')[process.env.NODE_ENV || 'development'];

const log = config.log();
const fastify = require('../server/service')(config);

// Important - a service should not have a fixed port but should randomly choose one

fastify.listen(process.env.PORT || 3000, '::', () => {
  const address: any = fastify.server.address();
  const port: number = address.port;

  log.info(
    `Hi there! I'm listening on port ${port} in ${process.env.NODE_ENV} mode.`,
  );
});
