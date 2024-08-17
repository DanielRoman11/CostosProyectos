import {
  Entity,
  ManyToOne,
  Column,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Professional } from './profesional.entity';
import { ProfessionalCostDetails } from './professional-cost-detail.entity';

@Entity()
export class ProfessionalItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Professional, { nullable: false, cascade: true })
  professional: Relation<Professional>;

  @ManyToOne(() => ProfessionalCostDetails, (costDetail) => costDetail.items, {
    nullable: false,
  })
  costDetail_id: Relation<ProfessionalCostDetails>;

  @Column('decimal', { scale: 2 })
  quantity: string;
}
