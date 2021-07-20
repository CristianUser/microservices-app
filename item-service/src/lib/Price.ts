/* eslint-disable no-param-reassign */
import { IConfig } from '../config';
import ItemPrice from '../db/entity/ItemPrice';
import CrudService from './Crud';

export default class PriceService extends CrudService<ItemPrice> {
  constructor(config: IConfig) {
    super(config, ItemPrice, ['item']);
  }

  async createItem(payload: any) {
    this.etag = Date.now();
    const results = await this.repository.find({ item: payload.item, currency: payload.currency });

    results.forEach((result) => {
      result.disabled = true;
    });
    await this.repository.save(results);

    return this.connection
      .createQueryBuilder()
      .insert()
      .into(this.entityClass)
      .values([payload])
      .execute()
      .then((result) => result.raw[0]);
  }
}
