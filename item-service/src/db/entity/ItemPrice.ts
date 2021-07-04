/* eslint-disable import/no-cycle */
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import Item from './Item';

@Entity()
export default class ItemPrice {
  constructor({ id, disabled, status, buying, selling, currency, rate }: any = {}) {
    this.id = id;
    this.disabled = disabled;
    this.status = status;
    this.buying = buying;
    this.selling = selling;
    this.currency = currency;
    this.rate = rate;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 3,
    default: 'USD'
  })
  currency: string;

  @Column({
    type: 'float'
  })
  rate: number;

  @Column({
    type: 'boolean',
    default: false
  })
  buying: boolean;

  @Column({
    type: 'boolean',
    default: true
  })
  selling: boolean;

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

  @ManyToOne(() => Item, (item) => item.prices)
  item?: Item;
}
