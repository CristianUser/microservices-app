/* eslint-disable import/no-cycle */
import { Entity, Column } from 'typeorm';
import CommonEntity from './Common';

@Entity()
export default class PosLayout extends CommonEntity {
  constructor({ id, name, data, description }: any = {}) {
    super();
    this.id = id;
    this.name = name;
    this.data = data;
    this.description = description;
  }

  @Column({
    type: 'text'
  })
  name: string;

  @Column({
    type: 'simple-json',
    default: '{}'
  })
  data: any;

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
