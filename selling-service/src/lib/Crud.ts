/* eslint-disable no-param-reassign */
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

  private relations: string[];

  constructor(config: IConfig, entityClass: EntityTarget<Entity>, relations: string[] = []) {
    this.config = config;
    this.entityClass = entityClass;
    this.relations = relations;
    this.repository = getRepository(this.entityClass);
    this.connection = getConnection();
    this.renameRelatedFields = this.renameRelatedFields.bind(this);
  }

  private renameRelatedFields(result: any) {
    this.relations.forEach((key) => {
      const idKey = `${key}Id`;

      result[key] = result[idKey];

      delete result[idKey];
    });

    return result;
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

  getItem(id: string, includeRelations = false) {
    const options = includeRelations ? { relations: this.relations } : {};

    if (includeRelations) {
      return this.repository.findOne(id, options);
    }
    return this.connection
      .createQueryBuilder()
      .select()
      .from(this.entityClass, '')
      .where({ id })
      .getRawOne()
      .then(this.renameRelatedFields);
  }

  async getItems(findOptions?: FindManyOptions<Entity>) {
    const [rows, count] = await this.repository.findAndCount(findOptions);

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
    const payload: any = { disabled: true, status: 'archived' };

    return this.repository.update(id, payload);
  }
}