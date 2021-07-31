/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */
import { IConfig } from '../config';
import PosSession from '../db/entity/PosSession';
import CrudService from './Crud';

export default class PosSessionService extends CrudService<PosSession> {
  constructor(config: IConfig) {
    super(config, PosSession, ['layout']);
  }

  private parseJson(result: any) {
    result.data = JSON.parse(result.data);

    return result;
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
      .then(this.renameRelatedFields)
      .then(this.parseJson);
  }
}
