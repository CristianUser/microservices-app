/* eslint-disable import/no-cycle */
import { Entity, Column, ManyToOne, Index } from 'typeorm';
import CommonEntity from './Common';
import Customer from './Customer';

@Entity()
export default class SaleOrder extends CommonEntity {
  constructor({ id, customer, description, items, subTotal, total }: any = {}) {
    super();
    this.id = id;
    this.customer = customer;
    this.description = description;
    this.items = items;
    this.subTotal = subTotal;
    this.total = total;
  }

  @Column({
    type: 'text',
    nullable: true
  })
  description?: string;

  @Column({
    type: 'simple-json',
    default: '[]'
  })
  items: string[];

  @Index()
  @ManyToOne(() => Customer, (customer) => customer.orders)
  customer: Customer;

  @Column('float')
  subTotal?: number;

  @Column('float')
  total?: number;
}
