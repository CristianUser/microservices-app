import jwt from 'jsonwebtoken';
import { IConfig } from '../config';
import { DatabaseClient } from '../db';

export class AuthService {
  private config: IConfig;

  private db: DatabaseClient;

  constructor(config: IConfig) {
    this.config = config;
    this.db = new DatabaseClient(config);
  }

  createToken(payload: any): string {
    return jwt.sign(payload, this.config.jwtSecret, {
      expiresIn: '15 minutes'
    });
  }

  readDigestInfo(digest: string) {
    try {
      return jwt.verify(digest, this.config.jwtSecret);
    } catch (err) {
      return null;
    }
  }

  validate(digest: string) {
    const decoded: any = this.readDigestInfo(digest);
    const timestamp = Date.now() / 1000;

    return decoded && decoded.exp > timestamp;
  }
}

export default AuthService;
