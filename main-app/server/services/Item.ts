import { IConfig } from '../config';
import { Item } from '../interfaces/Item';
import BasicCrud from './BasicCrud';

export class ItemService extends BasicCrud<Item> {
  constructor(config: IConfig) {
    super(config, { serviceName: 'item-service', routePrefix: '/' });
  }
}

export default ItemService;
