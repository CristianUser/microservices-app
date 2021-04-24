const path = require('path');

const bunyan = require('bunyan');
// Load package.json
const pjs = require('../package.json');

// Get some meta info from the package.json
const { name: packageName, version } = pjs;

// Set up a logger
const getLogger = (serviceName: string, serviceVersion: string, level: any) => bunyan.createLogger({ name: `${serviceName}:${serviceVersion}`, level });

// Configuration options for different environments
module.exports = {
  development: {
    name: packageName,
    version,
    serviceTimeout: 30,
    data: {
      images: path.join(__dirname, '../data/images'),
      speakers: path.join(__dirname, '../data/speakers.json'),
    },
    log: () => getLogger(packageName, version, 'debug'),
  },
  production: {
    name: packageName,
    version,
    serviceTimeout: 30,
    data: {
      images: path.join(__dirname, '../data/images'),
      speakers: path.join(__dirname, '../data/speakers.json'),
    },
    log: () => getLogger(packageName, version, 'info'),
  },
  test: {
    name: packageName,
    version,
    serviceTimeout: 30,
    data: {
      speakers: path.join(__dirname, '../data/speakers.json'),
    },
    log: () => getLogger(packageName, version, 'fatal'),
  },
};
