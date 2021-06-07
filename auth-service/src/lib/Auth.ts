import jwt from 'jsonwebtoken';
import { DatabaseClient } from '../db';

export class AuthService {
  private config: any;
  private jwtSecret: string;
  private db: DatabaseClient;
  constructor(config: any) {
    this.config = config;
    this.jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';
    this.db = new DatabaseClient(config);
  }

  createToken(payload: any): string {
    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: '15 minutes'
    })
  }

  readDigestInfo(digest: string) {
    try {
      return jwt.verify(digest, this.jwtSecret)
    }
    catch (err) {
      return null
    }
  }

  validate(digest: string) {
    const decoded: any = this.readDigestInfo(digest);
    const timestamp = Date.now() / 1000;

    return decoded && (decoded.exp > timestamp);
  }
}
