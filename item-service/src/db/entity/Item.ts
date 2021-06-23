import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Item {
  constructor({ id, name, description, barCode, disabled = false, status = 'active', uom, brand }: any = {}) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.barCode = barCode;
    this.disabled = disabled;
    this.status = status;
    this.uom = uom;
    this.brand = brand;
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 100
  })
  name: string;

  @Column('text')
  description?: string;

  @Column()
  barCode?: string;

  @Column()
  disabled: boolean;

  @Column('text')
  status: string;

  @Column('text')
  uom?: string;

  @Column('text')
  brand?: string;
}
