import { connect, Connection } from 'mongoose';

export class DatabaseClient {
  public client: Connection | undefined;

  private log;

  constructor(config: any) {
    this.log = config.log();
    connect(config.dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    })
      .then((client) => {
        this.client = client.connection;
        this.log.info('MongoDB Connected');
      })
      .catch((err) => {
        this.log.error(err);
      });
  }
}

export default DatabaseClient;
