import { FindManyOptions, getRepository, Repository } from 'typeorm';
import { IConfig } from '../config';
import { Item } from '../db/entity/Item';

export class ItemService {
  private config: IConfig;
  private itemRepository: Repository<Item>;
  constructor(config: IConfig) {
    this.config = config;
    this.itemRepository = getRepository(Item);
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
    return this.itemRepository.update(id, payload);
  }

  deleteItem(id: string) {
    return this.itemRepository.update(id, { disabled: true, status: 'deleted' });
  }
}

export default ItemService;
