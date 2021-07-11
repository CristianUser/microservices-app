/* eslint-disable import/no-cycle */
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class SaleOrder {
  constructor({ id, customer, description, disabled, status, items, subTotal, total }: any = {}) {
    this.id = id;
    this.customer = customer;
    this.description = description;
    this.disabled = disabled;
    this.status = status;
    this.items = items;
    this.subTotal = subTotal;
    this.total = total;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'text',
    nullable: true
  })
  description?: string;

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

  @Column('simple-json')
  items: string[];

  @Column({
    type: 'text'
  })
  customer: string;

  @Column('float')
  subTotal?: number;

  @Column('float')
  total?: number;
}
