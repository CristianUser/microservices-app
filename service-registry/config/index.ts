const bunyan = require('bunyan');
// Load package.json

// Get some meta info from the package.json
const { name: packageName, version } = require('../package.json');

// Set up a logger
const getLogger = (serviceName:any, serviceVersion:any, level: any) => bunyan.createLogger({ name: `${serviceName}:${serviceVersion}`, level });

// Configuration options for different environments
module.exports = {
  development: {
    name: packageName,
    version,
    serviceTimeout: 30,
    log: () => getLogger(packageName, version, 'debug'),
  },
  production: {
    name: packageName,
    version,
    serviceTimeout: 30,
    log: () => getLogger(packageName, version, 'info'),
  },
  test: {
    name: packageName,
    version,
    serviceTimeout: 30,
    log: () => getLogger(packageName, version, 'fatal'),
  },
};
