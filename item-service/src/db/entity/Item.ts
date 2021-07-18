/* eslint-disable import/no-cycle */
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import CommonEntity from './Common';
import ItemBrand from './ItemBrand';
import ItemGroup from './ItemGroup';
import ItemPrice from './ItemPrice';

@Entity()
export default class Item extends CommonEntity {
  constructor({ id, name, description, uom, brand, itemGroup, imageUrl, prices }: any = {}) {
    super();
    this.id = id;
    this.name = name;
    this.description = description;
    this.uom = uom;
    this.brand = brand;
    this.itemGroup = itemGroup;
    this.imageUrl = imageUrl;
    this.prices = prices;
  }

  @Column({
    length: 100
  })
  name: string;

  @Column({
    type: 'text',
    default: ''
  })
  description?: string;

  @Column({
    type: 'text',
    default: ''
  })
  imageUrl?: string;

  @Column({
    type: 'text',
    default: 'Unit'
  })
  uom?: string;

  @ManyToOne(() => ItemBrand, (brand) => brand.items)
  brand?: ItemBrand;

  @ManyToOne(() => ItemGroup, (group) => group.items)
  itemGroup: ItemGroup;

  @OneToMany(() => ItemPrice, (price) => price.item)
  prices: ItemPrice;
}
