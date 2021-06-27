/* eslint-disable import/no-cycle */
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import Item from './Item';

@Entity()
export default class ItemGroup {
  constructor({ id, name, description, disabled, status, imageUrl }: any = {}) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.disabled = disabled;
    this.status = status;
    this.imageUrl = imageUrl;
  }

  @PrimaryGeneratedColumn()
  id: number;

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

  @Column({
    type: 'boolean',
    default: false
  })
  disabled: boolean;

  @Column({
    type: 'enum',
    enum: ['active', 'draft', 'archived'],
    default: 'draft'
  })
  status: string;

  @OneToMany(() => Item, (item) => item.itemGroup)
  items?: Item[];
}
