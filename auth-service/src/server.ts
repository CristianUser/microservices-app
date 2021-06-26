import axios from 'axios';
import { FastifyInstance } from 'fastify';
import createService from './lib/service';
import { getConfig } from './config';

const config = getConfig();
const fastify: FastifyInstance = createService(config);
const log = config.log();

// Important - a service should not have a fixed port but should randomly choose one
fastify.listen(config.port || 0, '::', () => {
  const address: any = fastify.server.address();
  const { port } = address;

  const registerService = () =>
    axios.put(`${config.registryUrl}/register`, {
      serviceName: config.name,
      serviceVersion: config.version,
      servicePort: port
    });
  const unregisterService = () =>
    axios.delete(`${config.registryUrl}/register/${config.name}/${config.version}/${port}`);

  registerService();

  const interval = setInterval(registerService, config.serviceTimeout * 1000);
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

  log.info(`Hi there! I'm listening on port ${port} in ${config.env} mode.`);
});
