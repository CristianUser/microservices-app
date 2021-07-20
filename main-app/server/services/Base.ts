import axios, { AxiosRequestConfig } from 'axios';
import path from 'path';
import { CircuitBreaker } from '../lib/CircuitBreaker';

export interface IServiceInstance {
  ip: string;
  name: string;
  port: string;
  timestamp: number;
  version: string;
}
export abstract class BaseService {
  public circuitBreaker: CircuitBreaker;

  public serviceName: string;

  private serviceRegistryUrl: string;

  private serviceVersionIdentifier: string;

  constructor({ serviceRegistryUrl, serviceVersionIdentifier, serviceName }: any) {
    this.serviceRegistryUrl = serviceRegistryUrl;
    this.serviceVersionIdentifier = serviceVersionIdentifier;
    this.serviceName = serviceName;
    this.circuitBreaker = new CircuitBreaker();
  }

  // eslint-disable-next-line class-methods-use-this
  protected buildUrl(service: IServiceInstance, pathname: string = '/'): string {
    return `http://${service.ip}:${service.port}${path.normalize(pathname)}`;
  }

  protected async callService(requestOptions: AxiosRequestConfig) {
    return this.circuitBreaker.callService(requestOptions);
  }

  protected async getService(serviceName: string): Promise<IServiceInstance> {
    const response = await axios.get(
      `${this.serviceRegistryUrl}/find/${serviceName}/${this.serviceVersionIdentifier}`
    );
    return response.data;
  }
}

export default BaseService;
