import { IConfig } from '../config';
import { BaseService } from './Base';

interface ConstructorOptions {
  serviceName: string;
  routePrefix: string;
}

export default class BasicCrud<T> extends BaseService {
  private routePrefix: string;

  constructor(
    { serviceRegistryUrl, serviceVersionIdentifier }: IConfig,
    { routePrefix, serviceName }: ConstructorOptions
  ) {
    super({ serviceRegistryUrl, serviceVersionIdentifier, serviceName });

    this.routePrefix = routePrefix;
  }

  async createDoc(data: T) {
    const service = await this.getService(this.serviceName);
    return this.callService({
      method: 'post',
      url: this.buildUrl(service, this.routePrefix),
      data
    });
  }

  async getDoc(id: string) {
    const service = await this.getService(this.serviceName);
    return this.callService({
      method: 'get',
      url: this.buildUrl(service, `${this.routePrefix}${id}`)
    });
  }

  async getDocs() {
    const service = await this.getService(this.serviceName);
    return this.callService({
      method: 'get',
      url: this.buildUrl(service, this.routePrefix)
    });
  }

  async updateDoc(id: string, data: T) {
    const service = await this.getService(this.serviceName);
    return this.callService({
      method: 'put',
      url: this.buildUrl(service, `${this.routePrefix}${id}`),
      data
    });
  }

  async deleteDoc(id: string) {
    const service = await this.getService(this.serviceName);
    return this.callService({
      method: 'delete',
      url: this.buildUrl(service, `${this.routePrefix}${id}`)
    });
  }
}
