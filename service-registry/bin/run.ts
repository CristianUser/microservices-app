import service from '../server/service';
import { getConfig } from '../config';

const config = getConfig();
const log = config.log();
const fastify = service(config);

// Important - a service should not have a fixed port but should randomly choose one

fastify.listen(config.port || 3000, '::', () => {
  const address: any = fastify.server.address();
  const { port } = address;

  log.info(`Hi there! I'm listening on port ${port} in ${config.env} mode.`);
});
