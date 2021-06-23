const { REGISTRY_URL = 'http://localhost:3000' } = process.env

export default {
  development: {
    serviceRegistryUrl: REGISTRY_URL,
    serviceVersionIdentifier: '1.x.x',
  },
  production: {
    serviceRegistryUrl: REGISTRY_URL,
    serviceVersionIdentifier: '1.x.x',
  },
};
