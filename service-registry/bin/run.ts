#!/usr/bin/env node

const config = require('../config')[process.env.NODE_ENV || 'development'];

const log = config.log();
const fastify = require('../server/service')(config);

// Important - a service should not have a fixed port but should randomly choose one
fastify.listen(process.env.PORT || 3000);

fastify.ready(() => {
  log.info(
    `Hi there! I'm listening on port ${fastify} in ${process.env.NODE_ENV} mode.`,
  );
});
