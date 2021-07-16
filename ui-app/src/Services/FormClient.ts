import { BaseClient } from './BaseClient';

export default class FormClient extends BaseClient {
  constructor() {
    super({ baseUrl: `${process.env.REACT_APP_API_URL}` });
  }

  async getSchema(schema: string): Promise<any> {
    return this.callService({
      method: 'get',
      url: `/forms/${schema}`
    });
  }

  async getPages(): Promise<any> {
    return this.callService({
      method: 'get',
      url: '/forms/'
    });
  }
}
