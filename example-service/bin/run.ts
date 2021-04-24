#!/usr/bin/env node

import { FastifyInstance } from "fastify";

const axios = require('axios');

const config = require('../config')[process.env.NODE_ENV || 'development'];

const log = config.log();
const fastify: FastifyInstance = require('../server/service')(config);

// Important - a service should not have a fixed port but should randomly choose one
fastify.listen(0);

fastify.listen(0, () => {
  const address: any = fastify.server.address();
  const port: number = address.port;

  const registerService = () => axios.put('http://localhost:3000/register', {
    serviceName: config.name,
    serviceVersion: config.version,
    servicePort: port
  });
  const unregisterService = () => axios.delete(`http://localhost:3000/register/${config.name}/${config.version}/${port}`);

  registerService();

  const interval = setInterval(registerService, 20000);
  const cleanup = async () => {
    clearInterval(interval);
    await unregisterService();
  };

  process.on('uncaughtException', async () => {
    await cleanup();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    await cleanup();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await cleanup();
    process.exit(0);
  });

  log.info(
    `Hi there! I'm listening on port ${port} in ${'env'} mode.`,
  );
});
