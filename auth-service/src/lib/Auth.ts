import jwt from 'jsonwebtoken';

export class AuthService {
  private config: any;
  private jwtSecret: string;
  constructor(config: any) {
    this.config = config;
    this.jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';

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
