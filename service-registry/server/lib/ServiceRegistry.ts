const semver = require('semver');

export interface IServiceInstance {
  ip: string | undefined;
  name: string;
  port: string;
  timestamp: number;
  version: string;
}

export class ServiceRegistry {
  private services: {
    [key: string]: IServiceInstance
  } = {};
  private log;
  private timeout: number;

  constructor(log: any) {
    this.log = log;
    this.timeout = 30;
  }

  private _getServiceKey(name: string, version: string, ip: string | undefined, port: string): string {
    return `${name}@${version}_${ip}:${port}`;
  }

  get(name: string, version: string): IServiceInstance {
    this.cleanup();
    const candidates = Object.values(this.services).filter(
      (service: any) => service.name === name && semver.satisfies(service.version, version)
    );

    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  register(name: string, version: string, ip: string | undefined, port: string): string {
    this.cleanup();
    const key = this._getServiceKey(name, version, ip, port);
    const timestamp = Math.floor(Date.now() / 1000);

    if (!this.services[key]) {
      this.services[key] = {
        ip,
        name,
        port,
        timestamp,
        version
      };
      this.log.debug(`Added services ${name}, version ${version} at ${ip}:${port}`);
      return key;
    }

    this.services[key].timestamp = timestamp;
    this.log.debug(`Updated services ${name}, version ${version} at ${ip}:${port}`);
    return key;
  }

  unregister(name: string, version: string, ip: string | undefined, port: string): string {
    const key = this._getServiceKey(name, version, ip, port);

    delete this.services[key];
    this.log.debug(`Unregistered services ${name}, version ${version} at ${ip}:${port}`);
    return key;
  }

  cleanup() {
    const now = Math.floor(Date.now() / 1000);

    Object.keys(this.services).forEach((key) => {
      if (this.services[key].timestamp + this.timeout < now) {
        delete this.services[key];
        this.log.debug(`Removed service ${key}`);
      }
    });
  }
}
