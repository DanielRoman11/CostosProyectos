import { Staff } from '../../staff/entities/staff.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
	UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Professional {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  profession: string;

  @OneToOne(() => Staff, { nullable: false, cascade: true })
  @JoinColumn()
  staff_type: Relation<Staff>;

  @Column('decimal', { scale: 2 })
  unit_price: string;

	@CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
