import fs, { ReadStream } from 'fs';
import { FileStrategy } from './File';

function createDirectory(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export class HTTPError extends Error {
  public status: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.status = statusCode
  }
}

export class FsStrategy implements FileStrategy {
  private uploadDir: string;
  constructor (uploadDir?: string) {
    this.uploadDir = uploadDir || 'files'
  }

  getFsKey(path: string): string  {
    return `${this.uploadDir}/${path}`;
  }

  put(data: any, options: any = {}) {
    const { path = '' } = options;
    const uri = `${path}/${data.filename}`
    const fileDir = this.getFsKey(path);
    const key = this.getFsKey(uri);
  
    return new Promise((resolve, reject) => {
      createDirectory(fileDir);
      const writeStream = fs.createWriteStream(key);
  
      data.file.pipe(writeStream);
      writeStream.on('finish', () => {
        resolve({ uri, path });
      });
      writeStream.on('error', reject);
    });
  }
  
  get(path: string): ReadStream {
    const key = this.getFsKey(path);
  
    if (!fs.existsSync(key)) {
      throw new HTTPError('File Not Found', 404);
    }
    return fs.createReadStream(key);
  }
  
  delete(path: string): void {
    fs.unlinkSync(this.getFsKey(path));
  }
}
