import { Staff } from '../../staff/entities/staff.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Professional {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToOne(() => Staff, { nullable: false })
  @JoinColumn()
  staff_type: Staff;

  @Column('decimal', { scale: 2 })
  unit_price: string;
}
