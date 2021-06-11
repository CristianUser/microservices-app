import { createLogger } from 'bunyan';

export interface IConfig {
  serviceTimeout: number;
  log: () => any;
  env: string;
  name: any;
  port: string | number;
  version: any;
}
// Get some meta info from the package.json
const { name: packageName, version } = require('../package.json');

// Set up a logger
const getLogger = (serviceName: any, serviceVersion: any, level: any) =>
  createLogger({ name: `${serviceName}:${serviceVersion}`, level });
const { NODE_ENV = 'development', PORT = 3000 } = process.env;

const common = {
  env: NODE_ENV,
  name: packageName,
  port: PORT,
  version
};
// Configuration options for different environments
const configs: {
  [key: string]: IConfig;
} = {
  development: {
    ...common,
    serviceTimeout: 30,
    log: () => getLogger(packageName, version, 'debug')
  },
  production: {
    ...common,
    serviceTimeout: 30,
    log: () => getLogger(packageName, version, 'info')
  },
  test: {
    ...common,
    serviceTimeout: 30,
    log: () => getLogger(packageName, version, 'fatal')
  }
};

export function getConfig(): IConfig {
  return configs[NODE_ENV];
}

export default configs;
