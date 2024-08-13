import { Entity, ManyToOne, Relation } from 'typeorm';
import { Professional } from './profesional.entity';
import { CostDetail } from '../../common/shared/entities/cost-detail.entity';

@Entity()
export class ProfessionalCostDetails extends CostDetail {
  @ManyToOne(() => Professional, { nullable: false })
  professional: Relation<Professional>;
}
