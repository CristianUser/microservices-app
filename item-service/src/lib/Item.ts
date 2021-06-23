import jwt from 'jsonwebtoken';
import { IConfig } from '../config';
import { Item } from '../db/entity/Item'
import { getRepository, Repository } from 'typeorm';

export class ItemService {
  private config: IConfig;
  private itemRepository: Repository<Item>;
  constructor(config: IConfig) {
    this.config = config;
    this.itemRepository = getRepository(Item)
  }

  async createItem(payload: any) {
    const item = new Item(payload);

    return this.itemRepository.save(item);
  }
}

export default ItemService
