#!/usr/bin/env node

import axios from 'axios';
import { FastifyInstance } from 'fastify';
import createService from './lib/service';
import configs from './config';

const { NODE_ENV = 'development', REGISTRY_URL = 'http://localhost:3000' } = process.env;
const config: any = configs[NODE_ENV];
const fastify: FastifyInstance = createService(config);
const log = config.log();

// Important - a service should not have a fixed port but should randomly choose one
fastify.listen(process.env.PORT || 0, '::', () => {
  const address: any = fastify.server.address();
  const port: number = address.port;

  const registerService = () =>
    axios.put(`${REGISTRY_URL}/register`, {
      serviceName: config.name,
      serviceVersion: config.version,
      servicePort: port
    });
  const unregisterService = () =>
    axios.delete(
      `${REGISTRY_URL}/register/${config.name}/${config.version}/${port}`
    );

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

  process.on('unhandledRejection', async (error) => {
    log.fatal('unhandledRejection', error.message);
  });

  process.on('SIGINT', async () => {
    await cleanup();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await cleanup();
    process.exit(0);
  });

  log.info(`Hi there! I'm listening on port ${port} in ${NODE_ENV} mode.`);
});
