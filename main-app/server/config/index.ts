export default {
  development: {
    sitename: 'Main App [Development]',
    serviceRegistryUrl: process.env.REGISTRY_URL || 'http://localhost:3000',
    serviceVersionIdentifier: '1.x.x',
  },
  production: {
    sitename: 'Roux Meetups',
    serviceRegistryUrl: process.env.REGISTRY_URL || 'http://localhost:3000',
    serviceVersionIdentifier: '1.x.x',
  },
};
