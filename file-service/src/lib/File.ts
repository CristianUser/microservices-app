import { MultipartFile } from 'fastify-multipart';
import { ReadStream } from 'fs';

import { IConfig } from '../config';

export interface FileStrategy {
  put: (file: MultipartFile, options: any) => Promise<any>;
  get: (path: string) => ReadStream;
  delete: (path: string) => void;
}

function getValue(data: any, prop: string): any {
  return data.fields[prop]?.value;
}

export class FileService {
  private config: IConfig;

  private strategy: FileStrategy;

  constructor(config: IConfig, strategy: FileStrategy) {
    this.config = config;
    this.strategy = strategy;
  }

  async putFile(data: MultipartFile) {
    return this.strategy.put(data, {
      path: getValue(data, 'path'),
      filename: getValue(data, 'filename')
    });
  }

  getFile(path: string) {
    return this.strategy.get(path);
  }

  deleteFile(path: string) {
    return this.strategy.delete(path);
  }
}

export default FileService;
