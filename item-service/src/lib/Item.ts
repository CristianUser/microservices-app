import { Connection, FindManyOptions, getConnection, getRepository, Repository } from 'typeorm';
import { IConfig } from '../config';
import Item from '../db/entity/Item';

export class ItemService {
  private config: IConfig;

  private itemRepository: Repository<Item>;

  private connection: Connection;

  constructor(config: IConfig) {
    this.config = config;
    this.itemRepository = getRepository(Item);
    this.connection = getConnection();
  }

  async createItem(payload: any) {
    const item = new Item(payload);

    return this.itemRepository.save(item);
  }

  getItem(id: string) {
    return this.itemRepository.findOne(id);
  }

  async getItems(where?: FindManyOptions<Item>) {
    const [rows, count] = await this.itemRepository.findAndCount(where);

    return { rows, count };
  }

  updateItem(id: string, payload: any) {
    return this.connection
      .createQueryBuilder()
      .update(Item)
      .set(payload)
      .where({ id })
      .returning('*')
      .execute()
      .then((response) => response.raw[0]);
  }

  deleteItem(id: string) {
    return this.itemRepository.update(id, { disabled: true, status: 'deleted' });
  }
}

export default ItemService;
