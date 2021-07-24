/* eslint-disable import/no-cycle */
import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import CommonEntity from './Common';
import Department from './Department';
import Employee from './Employee';

@Entity()
export default class Position extends CommonEntity {
  constructor({ id, name, description }: any = {}) {
    super();
    this.id = id;
    this.name = name;
    this.description = description;
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

  @OneToMany(() => Employee, (employee) => employee.department)
  employees?: Employee[];

  @ManyToOne(() => Department, (department) => department.positions)
  department?: Department;
}
