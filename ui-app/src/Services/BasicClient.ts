import { BaseClient } from './BaseClient';

type BasicClientOptions = {
  routePrefix: string;
};

type SearchResult<T> = {
  rows: T[];
  count: number;
};

export default class BasicClient<DocInterface> extends BaseClient {
  constructor({ routePrefix }: BasicClientOptions) {
    super({ baseUrl: `${process.env.REACT_APP_API_URL}${routePrefix}` });
  }

  async createDoc(data: DocInterface): Promise<DocInterface> {
    return this.callService({
      method: 'post',
      url: '/',
      data
    });
  }

  async getDoc(id: string): Promise<DocInterface> {
    return this.callService({
      method: 'get',
      url: `/${id}`
    });
  }

  async getDocs(): Promise<SearchResult<DocInterface>> {
    return this.callService({
      method: 'get',
      url: '/'
    });
  }

  async updateDoc(id: string, data: DocInterface): Promise<DocInterface> {
    return this.callService({
      method: 'put',
      url: `/${id}`,
      data
    });
  }

  async deleteDoc(id: string) {
    return this.callService({
      method: 'delete',
      url: `/${id}`
    });
  }

  async save(id: string, data: DocInterface) {
    if (id && id !== 'new') {
      return this.updateDoc(id, data);
    }
    return this.createDoc(data);
  }
}
