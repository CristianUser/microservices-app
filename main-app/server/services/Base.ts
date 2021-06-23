import axios, { AxiosRequestConfig } from 'axios';
import CircuitBreaker from '../lib/CircuitBreaker';

const circuitBreaker = new CircuitBreaker();

export class BaseService {
  public serviceName: string;
  private serviceRegistryUrl: string;
  private serviceVersionIdentifier: string;
  constructor({ serviceRegistryUrl, serviceVersionIdentifier, serviceName }: any) {
    this.serviceRegistryUrl = serviceRegistryUrl;
    this.serviceVersionIdentifier = serviceVersionIdentifier;
    this.serviceName = serviceName
  }

  buildUrl(ip: string, port: string): string {
    return `http://${ip}:${port}/`
  }

  async callService(requestOptions: AxiosRequestConfig) {
    return circuitBreaker.callService(requestOptions);
  }

  async getService(serviceName: string) {
    const response = await axios.get(`${this.serviceRegistryUrl}/find/${serviceName}/${this.serviceVersionIdentifier}`);
    return response.data;
  }
}

export default BaseService;
