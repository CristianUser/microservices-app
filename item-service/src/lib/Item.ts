/* eslint-disable no-param-reassign */
import { IConfig } from '../config';
import Item from '../db/entity/Item';
import CrudService from './Crud';

function addPriceToBody(results: any[]) {
  return results.map((result) => {
    result.price = result?.prices?.[0]?.rate;
    return result;
  });
}

export default class ItemService extends CrudService<Item> {
  constructor(config: IConfig) {
    super(config, Item, ['itemGroup', 'brand', 'prices']);
  }

  async getPricedItems(where = {}) {
    return this.connection
      .createQueryBuilder(Item, 'item')
      .leftJoinAndSelect('item.prices', 'price')
      .where(where)
      .andWhere('price.disabled = :disabled', { disabled: false })
      .getMany()
      .then(addPriceToBody);
  }
}
