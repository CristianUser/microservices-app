import { IConfig } from '../config';
import { BaseService } from './Base';

interface ConstructorOptions {
  serviceName: string;
  routePrefix: string;
}

export interface GetDocsResult<T> {
  rows: T[];
  count: number;
}

export default class BasicCrud<T> extends BaseService {
  public routePrefix: string;

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

  async getDoc(id: string, params: any): Promise<T> {
    const service = await this.getService(this.serviceName);
    return this.callService({
      method: 'get',
      url: this.buildUrl(service, `${this.routePrefix}${id}`),
      params
    });
  }

  async getDocs(params: any): Promise<GetDocsResult<T>> {
    const service = await this.getService(this.serviceName);
    return this.callService({
      method: 'get',
      url: this.buildUrl(service, this.routePrefix),
      params
    });
  }

  async updateDoc(id: string, data: T): Promise<T> {
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
