import { Entity, ManyToOne, Relation } from 'typeorm';
import { Professional } from './profesional.entity';
import { CostDetail } from '../../common/shared/entities/cost-detail.entity';
import { Project } from '../../projects/entities/project.entity';

@Entity()
export class ProfessionalCostDetails extends CostDetail {
  @ManyToOne(() => Professional, { nullable: false })
  professional: Relation<Professional>;

  @ManyToOne(() => Project, { nullable: false })
  project: Relation<Project>;
}
