import axios, { AxiosRequestConfig } from 'axios';
import { CircuitBreaker } from '../lib/CircuitBreaker';

const circuitBreaker = new CircuitBreaker();

export interface IServiceInstance {
  ip: string;
  name: string;
  port: string;
  timestamp: number;
  version: string;
}
export class BaseService {
  public serviceName: string;

  private serviceRegistryUrl: string;

  private serviceVersionIdentifier: string;

  constructor({ serviceRegistryUrl, serviceVersionIdentifier, serviceName }: any) {
    this.serviceRegistryUrl = serviceRegistryUrl;
    this.serviceVersionIdentifier = serviceVersionIdentifier;
    this.serviceName = serviceName;
  }

  // eslint-disable-next-line class-methods-use-this
  protected buildUrl(service: IServiceInstance, path: string = '/'): string {
    return `http://${service.ip}:${service.port}${path}`;
  }

  // eslint-disable-next-line class-methods-use-this
  protected async callService(requestOptions: AxiosRequestConfig) {
    return circuitBreaker.callService(requestOptions);
  }

  protected async getService(serviceName: string): Promise<IServiceInstance> {
    const response = await axios.get(
      `${this.serviceRegistryUrl}/find/${serviceName}/${this.serviceVersionIdentifier}`
    );
    return response.data;
  }
}

export default BaseService;
