import { getRepository, Repository } from 'typeorm';
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

  getItems(where?: any) {
    return this.itemRepository.find(where);
  }

  updateItem(id: string, payload: any) {
    return this.itemRepository.update(id, payload);
  }

  deleteItem(id: string) {
    return this.itemRepository.update(id, { disabled: true, status: 'deleted' });
  }
}

export default ItemService;
