import { Item, PricedItem } from '../Utils/interfaces';
import BasicClient from './BasicClient';

export class ItemClient extends BasicClient<Item> {
  constructor() {
    super({ routePrefix: '/item/item' });
  }

  async getPricedItems(params?: any): Promise<PricedItem[]> {
    return this.callService({
      method: 'get',
      url: '/priced',
      params
    });
  }
}

export default new ItemClient();
