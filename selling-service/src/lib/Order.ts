/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */
import { IConfig } from '../config';
import SaleOrder from '../db/entity/SaleOrder';
import CrudService from './Crud';

export default class OrderService extends CrudService<SaleOrder> {
  constructor(config: IConfig) {
    super(config, SaleOrder, ['customer']);
  }

  private parseJson(result: any) {
    result.items = JSON.parse(result.items);

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
