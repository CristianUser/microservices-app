import {
  Column,
  CreateDateColumn,
  Generated,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn
} from 'typeorm';

export default abstract class CommonEntity {
  @Column()
  @Generated('increment')
  cid?: number;

  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({
    type: 'boolean',
    default: false
  })
  disabled?: boolean;

  @Index()
  @Column({
    type: 'enum',
    enum: ['active', 'draft', 'archived'],
    default: 'draft'
  })
  status?: string;

  @VersionColumn()
  version?: number;

  @UpdateDateColumn()
  updatedAt?: Date;

  @CreateDateColumn()
  createdAt?: Date;
}
