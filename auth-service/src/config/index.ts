import Logger, { createLogger } from 'bunyan';
import packageJson from '../../package.json';

export interface IConfig {
  dbUrl: string;
  serviceTimeout: number;
  log: () => Logger;
  env: string;
  name: string;
  port: string | number;
  registryUrl: string;
  version: string;
  jwtSecret: string;
}

// Get some meta info from the package.json
const { name: packageName, version } = packageJson;

// Set up a logger
const getLogger = (serviceName: string, serviceVersion: string, level: any) =>
  createLogger({ name: `${serviceName}:${serviceVersion}`, level });
const {
  NODE_ENV = 'development',
  REGISTRY_URL = 'http://localhost:3000',
  PORT = 0,
  JWT_SECRET = 'your_jwt_secret'
} = process.env;

const common = {
  env: NODE_ENV,
  name: packageName,
  port: PORT,
  registryUrl: REGISTRY_URL,
  jwtSecret: JWT_SECRET,
  version
};
const configs: any = {
  development: {
    ...common,
    dbUrl: 'mongodb://mongodb/auth_db',
    serviceTimeout: 360,
    log: () => getLogger(packageName, version, 'debug')
  },
  production: {
    ...common,
    dbUrl: 'mongodb://mongodb/auth_db',
    serviceTimeout: 30,
    log: () => getLogger(packageName, version, 'info')
  }
};

export function getConfig(): IConfig {
  return configs[NODE_ENV];
}
// Configuration options for different environments
export default configs;
