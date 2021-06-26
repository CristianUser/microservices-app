import { IConfig } from '../config';
import { BaseService } from './Base';

export class ItemService extends BaseService {
  constructor({ serviceRegistryUrl, serviceVersionIdentifier }: IConfig) {
    super({ serviceRegistryUrl, serviceVersionIdentifier, serviceName: 'item-service' });
  }

  async createItem(data: any) {
    const service = await this.getService(this.serviceName);
    return this.callService({
      method: 'post',
      url: this.buildUrl(service),
      data
    });
  }

  async getItem(id: string) {
    const service = await this.getService(this.serviceName);
    return this.callService({
      method: 'get',
      url: this.buildUrl(service, `/${id}`)
    });
  }

  async getItems() {
    const service = await this.getService(this.serviceName);
    return this.callService({
      method: 'get',
      url: this.buildUrl(service)
    });
  }

  async updateItem(id: string, data: any) {
    const service = await this.getService(this.serviceName);
    return this.callService({
      method: 'put',
      url: this.buildUrl(service, `/${id}`),
      data
    });
  }

  async deleteItem(id: string) {
    const service = await this.getService(this.serviceName);
    return this.callService({
      method: 'delete',
      url: this.buildUrl(service, `/${id}`)
    });
  }
}

export default ItemService;
