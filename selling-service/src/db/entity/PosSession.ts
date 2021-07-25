/* eslint-disable import/no-cycle */
import { Entity, Column } from 'typeorm';
import CommonEntity from './Common';

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
    type: 'text'
  })
  layout: string;

  @Column({
    type: 'text',
    nullable: true
  })
  description?: string;

  @Column({
    type: 'date',
    default: new Date()
  })
  startDate?: Date;

  @Column({
    type: 'date',
    nullable: true
  })
  endDate?: Date;
}
