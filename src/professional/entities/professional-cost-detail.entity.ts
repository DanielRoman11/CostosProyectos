import { Entity, ManyToOne, OneToMany, Relation } from 'typeorm';
import { CostDetail } from '../../common/shared/entities/cost-detail.entity';
import { Project } from '../../projects/entities/project.entity';
import { ProfessionalItem } from './professional-item.entity';

@Entity()
export class ProfessionalCostDetails extends CostDetail {
  @ManyToOne(() => Project, { nullable: false })
  project: Relation<Project>;

  @OneToMany(() => ProfessionalItem, (items) => items.costDetail_id, {
    cascade: true,
  })
  items: Relation<ProfessionalItem[]>;
}
