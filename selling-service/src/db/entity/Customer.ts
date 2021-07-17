/* eslint-disable import/no-cycle */
import { Entity, Column, OneToMany } from 'typeorm';
import CommonEntity from './Common';
import SaleOrder from './SaleOrder';

@Entity()
export default class Customer extends CommonEntity {
  constructor({ id, name, description }: any = {}) {
    super();
    this.id = id;
    this.name = name;
    this.description = description;
  }

  @Column({
    type: 'text'
  })
  name: string;

  @Column({
    type: 'text',
    nullable: true
  })
  description?: string;

  @OneToMany(() => SaleOrder, (order) => order.customer)
  orders?: SaleOrder[];
}
