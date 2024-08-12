import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Supply {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column('decimal', { scale: 2 })
  unit_price: string;

  @Column()
  category: string;
}
