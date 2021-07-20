/* eslint-disable import/no-cycle */
import { Entity, Column, OneToMany } from 'typeorm';
import CommonEntity from './Common';
import Employee from './Employee';

@Entity()
export default class Department extends CommonEntity {
  constructor({ id, name, description, imageUrl }: any = {}) {
    super();
    this.id = id;
    this.name = name;
    this.description = description;
    this.imageUrl = imageUrl;
  }

  @Column({
    length: 100
  })
  name: string;

  @Column({
    type: 'text',
    default: ''
  })
  description?: string;

  @Column({
    type: 'text',
    default: ''
  })
  imageUrl?: string;

  @OneToMany(() => Employee, (employee) => employee.department)
  employees?: Employee[];
}
