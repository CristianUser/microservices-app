/* eslint-disable import/no-cycle */
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import ItemGroup from './ItemGroup';
import ItemPrice from './ItemPrice';

@Entity()
export default class Item {
  constructor({
    id,
    name,
    description,
    disabled,
    status,
    uom,
    brand,
    itemGroup,
    imageUrl,
    prices
  }: any = {}) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.disabled = disabled;
    this.status = status;
    this.uom = uom;
    this.brand = brand;
    this.itemGroup = itemGroup;
    this.imageUrl = imageUrl;
    this.prices = prices;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 100
  })
  name: string;

  @Column('text')
  description?: string;

  @Column({
    type: 'text',
    default: ''
  })
  imageUrl?: string;

  @Column({
    type: 'boolean',
    default: false
  })
  disabled: boolean;

  @Column({
    type: 'enum',
    enum: ['active', 'draft', 'archived'],
    default: 'draft'
  })
  status: string;

  @Column({
    type: 'text',
    default: 'Unit'
  })
  uom?: string;

  @Column({
    type: 'text',
    default: ''
  })
  brand?: string;

  @ManyToOne(() => ItemGroup, (group) => group.items)
  itemGroup: ItemGroup;

  @OneToMany(() => ItemPrice, (price) => price.item)
  prices: ItemPrice;
}
