/* eslint-disable import/no-cycle */
import { Entity, Column, ManyToOne } from 'typeorm';
import CommonEntity from './Common';
import Employee from './Employee';

@Entity()
export default class LeaveApplication extends CommonEntity {
  constructor({ id, reason, startDate, endDate, employee }: any = {}) {
    super();
    this.id = id;
    this.reason = reason;
    this.startDate = startDate;
    this.endDate = endDate;
    this.employee = employee;
  }

  @Column({
    type: 'text',
    default: ''
  })
  reason?: string;

  @Column({
    type: 'date',
    nullable: true
  })
  startDate: Date;

  @Column({
    type: 'date',
    nullable: true
  })
  endDate: Date;

  @Column({
    type: 'enum',
    enum: ['sent', 'in-progress', 'approved'],
    default: 'sent'
  })
  approvalStatus?: string;

  @Column({
    type: 'enum',
    enum: ['vacation', 'health', 'other'],
    default: 'vacation'
  })
  leaveType?: string;

  @ManyToOne(() => Employee, (employee) => employee.leaveApplications)
  employee: Employee;

  @ManyToOne(() => Employee, (employee) => employee.approvedApplications)
  approver?: Employee;
}
