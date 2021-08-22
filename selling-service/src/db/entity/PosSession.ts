/* eslint-disable import/no-cycle */
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import CommonEntity from './Common';
import PosLayout from './PosLayout';
import SaleOrder from './SaleOrder';

@Entity()
export default class PosSession extends CommonEntity {
  constructor({ id, employee, layout, description }: any = {}) {
    super();
    this.id = id;
    this.employee = employee;
    this.layout = layout;
    this.description = description;
  }

  @Column({
    type: 'text'
  })
  employee: string;

  @Column({
    type: 'text',
    nullable: true
  })
  description?: string;

  @Column({
    type: 'timestamp',
    default: new Date()
  })
  startDate?: Date;

  @Column({
    type: 'timestamp',
    nullable: true
  })
  endDate?: Date;

  @Column({
    type: 'simple-json',
    default: {}
  })
  data?: string;

  @OneToMany(() => SaleOrder, (order) => order.session)
  orders?: SaleOrder;

  @ManyToOne(() => PosLayout, (posLayout) => posLayout.sessions)
  layout: PosLayout;
}
