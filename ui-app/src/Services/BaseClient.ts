import { message } from 'antd';
import axios, { AxiosRequestConfig } from 'axios';

export abstract class BaseClient {
  baseUrl: string;

  constructor({ baseUrl }: any) {
    this.baseUrl = baseUrl;
  }

  async callService(requestOptions: AxiosRequestConfig) {
    try {
      const response = await axios({ baseURL: this.baseUrl, ...requestOptions });

      return response.data;
    } catch (err) {
      message.error('Request Failed');
      throw err;
    }
  }
}

export default BaseClient;
