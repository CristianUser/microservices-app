import { Item } from '../Utils/interfaces';
import CrudClient from './CrudClient';

export class ItemClient extends CrudClient<Item> {
  constructor() {
    super({ routePrefix: '/item' });
  }
}

export default new ItemClient();
