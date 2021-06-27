import CrudClient from './CrudClient';

export class ItemClient extends CrudClient<any> {
  constructor() {
    super({ routePrefix: '/item' });
  }
}

export default new ItemClient();
