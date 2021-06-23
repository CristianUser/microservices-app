import { Connection, createConnection, getConnection } from 'typeorm';
import { IConfig, getConfig } from '../config';

export class DatabaseClient {
  public client: Connection | undefined;
  private log;
  constructor(config: IConfig) {
    this.log = config.log();
    try {
      this.client = getConnection();
    } catch (error) {}
  }

  async connect() {
    if (!this.client) {
      return createConnection()
      .then((client) => {
        this.client = client;
        this.log.info('Postgres Connected');
      })
      .catch((err) => {
        this.log.error(err);
      });
    }

    return this
  }
}

export default new DatabaseClient(getConfig());
