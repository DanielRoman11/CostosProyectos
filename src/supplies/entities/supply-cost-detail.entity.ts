import { Entity, ManyToOne, OneToMany, Relation } from 'typeorm';
import { CostDetail } from '../../common/shared/entities/cost-detail.entity';
import { Project } from '../../projects/entities/project.entity';
import { SupplyItem } from './supply-item.entity';

@Entity()
export class SupplyCostDetails extends CostDetail {
  @OneToMany(() => SupplyItem, (items) => items.costDetail_id, {
    cascade: true,
  })
  items: Relation<SupplyItem[]>;

  @ManyToOne(() => Project, { nullable: false })
  project: Relation<Project>;
}
