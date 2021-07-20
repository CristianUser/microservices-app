/* eslint-disable import/no-cycle */
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import CommonEntity from './Common';
import Department from './Department';
import LeaveApplication from './LeaveApplication';

@Entity()
export default class Employee extends CommonEntity {
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

  @Column({
    type: 'text',
    nullable: true
  })
  position?: string;

  @Column({
    type: 'enum',
    enum: ['fulltime', 'part-time', 'intern']
  })
  employmentType?: string;

  @Column({
    type: 'enum',
    enum: ['male', 'female', 'other']
  })
  gender?: string;

  @Column({
    type: 'simple-json',
    default: '{}'
  })
  contacts?: string;

  @Column({
    type: 'date',
    nullable: true
  })
  joinDate?: Date;

  @Column({
    type: 'date',
    nullable: true
  })
  birthDate?: Date;

  @ManyToOne(() => Department, (department) => department.employees)
  department?: Department;

  @OneToMany(() => LeaveApplication, (leaveApplication) => leaveApplication.employee)
  leaveApplications?: LeaveApplication;

  @OneToMany(() => LeaveApplication, (leaveApplication) => leaveApplication.approver)
  approvedApplications?: LeaveApplication;
}
