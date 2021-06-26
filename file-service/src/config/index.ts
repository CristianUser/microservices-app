import Logger, { createLogger } from 'bunyan';
import packageJson from '../../package.json';

export interface IConfig {
  serviceTimeout: number;
  log: () => Logger;
  env: string;
  name: string;
  port: string | number;
  registryUrl: string;
  version: string;
  uploadDir: string;
}

// Get some meta info from the package.json
const { name: packageName, version } = packageJson;

// Set up a logger
const getLogger = (serviceName: string, serviceVersion: string, level: any) =>
  createLogger({ name: `${serviceName}:${serviceVersion}`, level });
const { NODE_ENV = 'development', REGISTRY_URL = 'http://localhost:3000', PORT = 0 } = process.env;

const common = {
  env: NODE_ENV,
  name: packageName,
  port: PORT,
  registryUrl: REGISTRY_URL,
  version,
  uploadDir: 'files'
};
const configs: any = {
  development: {
    ...common,
    serviceTimeout: 30,
    log: () => getLogger(packageName, version, 'debug')
  },
  production: {
    ...common,
    serviceTimeout: 30,
    log: () => getLogger(packageName, version, 'info')
  }
};

export function getConfig(): IConfig {
  return configs[NODE_ENV];
}
// Configuration options for different environments
export default configs;
