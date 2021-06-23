export interface IConfig {
  serviceRegistryUrl: string;
  serviceVersionIdentifier: string;
  port: number | string;
}

const { NODE_ENV = 'development', REGISTRY_URL = 'http://localhost:3000', PORT = 3001 } = process.env
const common = {
  serviceRegistryUrl: REGISTRY_URL,
  port: PORT
}
const configs: any = {
  development: {
    ...common,
    serviceVersionIdentifier: '1.x.x',
  },
  production: {
    ...common,
    serviceVersionIdentifier: '1.x.x',
  },
}
export function getConfig(): IConfig {
  return configs[NODE_ENV];
}

export default configs;
