import { Item } from '../Utils/interfaces';
import BasicClient from './BasicClient';

export class ItemClient extends BasicClient<Item> {
  constructor() {
    super({ routePrefix: '/item' });
  }
}

export default new ItemClient();
