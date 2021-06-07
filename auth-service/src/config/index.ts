import packageJson from '../../package.json';

const bunyan = require('bunyan');
// Load package.json

// Get some meta info from the package.json
const { name: packageName, version } = packageJson;

// Set up a logger
const getLogger = (serviceName: string, serviceVersion: string, level: any) => bunyan.createLogger({ name: `${serviceName}:${serviceVersion}`, level });
const config: any = {
  development: {
    dbUrl: 'mongodb://mongodb/auth_db',
    name: packageName,
    version,
    serviceTimeout: 30,
    log: () => getLogger(packageName, version, 'debug'),
  },
  production: {
    dbUrl: 'mongodb://mongodb/auth_db',
    name: packageName,
    version,
    serviceTimeout: 30,
    log: () => getLogger(packageName, version, 'info'),
  }
}
// Configuration options for different environments
export default config;
