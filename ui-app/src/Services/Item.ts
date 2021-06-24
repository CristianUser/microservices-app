import { BaseClient } from './BaseClient';

export class ItemClient extends BaseClient {
  constructor({ host }: any) {
    super({ baseUrl: `${host}/item` })
  }

  async createItem(data: any) {
    return this.callService({
      method: 'post',
      url: '/',
      data
    });
  }

  async getItem(id: string) {
    return this.callService({
      method: 'get',
      url: `/${id}`
    });
  }

  async getItems() {
    return this.callService({
      method: 'get',
      url: '/'
    });
  }

  async updateItem(id: string, data: any) {
    return this.callService({
      method: 'put',
      url: `/${id}`,
      data
    });
  }

  async deleteItem(id: string) {
    return this.callService({
      method: 'delete',
      url: `/${id}`
    });
  }
}

export default new ItemClient({ host: 'http://localhost:5000' });
