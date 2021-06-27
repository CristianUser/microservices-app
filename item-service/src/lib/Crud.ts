import {
  Connection,
  EntityTarget,
  FindManyOptions,
  getConnection,
  getRepository,
  ObjectLiteral,
  Repository
} from 'typeorm';
import { IConfig } from '../config';

export default class CrudService<Entity extends ObjectLiteral> {
  private config: IConfig;

  private repository: Repository<Entity>;

  private connection: Connection;

  private entityClass: EntityTarget<Entity>;

  constructor(config: IConfig, entityClass: EntityTarget<Entity>) {
    this.config = config;
    this.entityClass = entityClass;
    this.repository = getRepository(this.entityClass);
    this.connection = getConnection();
  }

  async createItem(payload: any) {
    return this.connection
      .createQueryBuilder()
      .insert()
      .into(this.entityClass)
      .values([payload])
      .execute()
      .then((result) => result.raw[0]);
  }

  getItem(id: string) {
    return this.repository.findOne(id);
  }

  async getItems(where?: FindManyOptions<Entity>) {
    const [rows, count] = await this.repository.findAndCount(where);

    return { rows, count };
  }

  updateItem(id: string, payload: any) {
    return this.connection
      .createQueryBuilder()
      .update(this.entityClass)
      .set(payload)
      .where({ id })
      .returning('*')
      .execute()
      .then((result) => result.raw[0]);
  }

  deleteItem(id: string) {
    const payload: any = { disabled: true, status: 'deleted' };

    return this.repository.update(id, payload);
  }
}
