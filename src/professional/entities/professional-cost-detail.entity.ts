import { Entity, JoinTable, ManyToMany, ManyToOne, Relation } from 'typeorm';
import { Professional } from './profesional.entity';
import { CostDetail } from '../../common/shared/entities/cost-detail.entity';
import { Project } from '../../projects/entities/project.entity';

@Entity()
export class ProfessionalCostDetails extends CostDetail {
  @ManyToMany(() => Professional)
  @JoinTable({
    name: 'profressional_cost_details',
    joinColumn: { name: 'cost_detail_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'professional_id', referencedColumnName: 'id' },
  })
  professionals: Relation<Professional[]>;

  @ManyToOne(() => Project, { nullable: false })
  project: Relation<Project>;
}
