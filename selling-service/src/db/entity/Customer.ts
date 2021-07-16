/* eslint-disable import/no-cycle */
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import SaleOrder from './SaleOrder';

@Entity()
export default class Customer {
  constructor({ id, name, description, disabled, status }: any = {}) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.disabled = disabled;
    this.status = status;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'text'
  })
  name: string;

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

  @OneToMany(() => SaleOrder, (order) => order.customer)
  orders?: SaleOrder[];
}
