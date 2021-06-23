import { ReadStream } from 'fs';

import { IConfig } from '../config';

export interface FileStrategy {
  put: (file: any, options: any) => Promise<any>;
  get: (path: string) => ReadStream
  delete: (path: string) => void
}

export class FileService {
  private config: IConfig;
  private strategy: FileStrategy;
  constructor(config: IConfig, strategy: FileStrategy) {
    this.config = config;
    this.strategy = strategy
  }

  async putFile(file: any, options: any) {
    return this.strategy.put(file, options);
  }

  getFile(path: string) {
    return this.strategy.get(path);
  }

  deleteFile(path: string) {
    return this.strategy.delete(path);
  }
}

export default FileService;
