import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Supply {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  material: string;

  @Column('decimal', { scale: 2 })
  unit_price: string;
}
