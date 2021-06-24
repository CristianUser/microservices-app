import { IConfig } from '../config';
import { BaseService } from './Base';

export class FilesService extends BaseService {
  constructor({ serviceRegistryUrl, serviceVersionIdentifier }: IConfig) {
    super({ serviceRegistryUrl, serviceVersionIdentifier, serviceName: 'file-service' })
  }

  async postFile(data: any) {
    const service = await this.getService(this.serviceName);
    return this.callService({
      method: 'post',
      url: this.buildUrl(service),
      data
    });
  }

  async getFile(id: string) {
    const service = await this.getService(this.serviceName);
    return this.callService({
      method: 'get',
      url: this.buildUrl(service, `/${id}`),
      responseType: 'stream'
    });
  }
}

export default FilesService;
