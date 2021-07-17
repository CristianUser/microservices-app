import {
  Column,
  CreateDateColumn,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn
} from 'typeorm';

export default abstract class CommonEntity {
  @PrimaryGeneratedColumn()
  cid?: number;

  @Column()
  @Generated('uuid')
  id!: string;

  @Column({
    type: 'boolean',
    default: false
  })
  disabled!: boolean;

  @Column({
    type: 'enum',
    enum: ['active', 'draft', 'archived'],
    default: 'draft'
  })
  status!: string;

  @VersionColumn()
  version!: number;

  @UpdateDateColumn()
  updatedAt!: Date;

  @CreateDateColumn()
  createdAt!: Date;
}
