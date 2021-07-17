/* eslint-disable import/no-cycle */
import { Entity, Column, ManyToOne } from 'typeorm';
import CommonEntity from './Common';
import Item from './Item';

@Entity()
export default class ItemPrice extends CommonEntity {
  constructor({ id, buying, selling, currency, rate }: any = {}) {
    super();
    this.id = id;
    this.buying = buying;
    this.selling = selling;
    this.currency = currency;
    this.rate = rate;
  }

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

  @ManyToOne(() => Item, (item) => item.prices, {
    nullable: false
  })
  item?: Item;
}
