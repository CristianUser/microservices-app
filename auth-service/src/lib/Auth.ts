import jwt from 'jsonwebtoken';

export class AuthService {
  private config: any;
  private jwtSecret: string;
  constructor(config: any) {
    this.config = config;
    this.jwtSecret = process.env.JWT_SECRET || '';

  }

  createToken(payload: any): string {
    return jwt.sign(JSON.stringify(payload), this.jwtSecret || 'your_jwt_secret')
  }

  readDigestInfo(digest: string) {
    return jwt.verify(digest, this.jwtSecret)
  }

  validate(digest: string) {
    const payload = this.readDigestInfo(digest);

    return !!payload;
  }
}
