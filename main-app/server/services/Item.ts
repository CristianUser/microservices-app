import { IConfig } from '../config';
import { BaseService } from './Base';

export class ItemService extends BaseService {
  constructor({ serviceRegistryUrl, serviceVersionIdentifier }: IConfig) {
    super({ serviceRegistryUrl, serviceVersionIdentifier, serviceName: 'item-service' })
  }

  async createItem(data: any) {
    const service = await this.getService(this.serviceName);
    return this.callService({
      method: 'post',
      url: this.buildUrl(service),
      data
    });
  }
}

export default ItemService;
