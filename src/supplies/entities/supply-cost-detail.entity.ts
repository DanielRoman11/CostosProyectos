import { Entity, ManyToOne, Relation } from 'typeorm';
import { Supply } from './supply.entity';
import { CostDetail } from '../../common/shared/entities/cost-detail.entity';
import { Project } from '../../projects/entities/project.entity';

@Entity()
export class SupplyCostDetails extends CostDetail {
  @ManyToOne(() => Supply, { nullable: false })
  supply: Relation<Supply>;

	@ManyToOne(() => Project, { nullable: false })
  project: Relation<Project>;
}
