import { BaseService } from './Base';

export class ItemService extends BaseService {
  constructor({ serviceRegistryUrl, serviceVersionIdentifier }: any) {
    super({ serviceRegistryUrl, serviceVersionIdentifier, serviceName: 'item-service' })
  }

  async createItem(data: any) {
    const { ip, port } = await this.getService(this.serviceName);
    return this.callService({
      method: 'post',
      url: `http://${ip}:${port}/`,
      data
    });
  }
}

export default ItemService;
