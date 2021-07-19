import { IConfig } from '../config';
import { Item } from '../interfaces/Item';
import BasicCrud from './BasicCrud';

export default class ItemService extends BasicCrud<Item> {
  constructor(config: IConfig) {
    super(config, {
      routePrefix: '/item',
      serviceName: 'item-service'
    });
  }

  async getPricedItems(params: any): Promise<Item[]> {
    const service = await this.getService(this.serviceName);
    return this.callService({
      method: 'get',
      url: this.buildUrl(service, `${this.routePrefix}/priced`),
      params
    });
  }
}
