/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */
import { IConfig } from '../config';
import PosLayout from '../db/entity/PosLayout';
import CrudService from './Crud';

export default class PosLayoutService extends CrudService<PosLayout> {
  constructor(config: IConfig) {
    super(config, PosLayout, []);
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
