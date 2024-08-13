import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class CostDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  unit: string;

  @Column('int')
  quantity: number;

  @Column('decimal', { scale: 2 })
  total_cost: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
