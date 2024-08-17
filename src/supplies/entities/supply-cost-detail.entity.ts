import { Entity, JoinColumn, ManyToOne, OneToMany, Relation } from 'typeorm';
import { CostDetail } from '../../common/shared/entities/cost-detail.entity';
import { Project } from '../../projects/entities/project.entity';
import { SupplyItem } from './supply-item.entity';
import { Category } from '../../categories/entities/category.entity';

@Entity()
export class SupplyCostDetails extends CostDetail {
  @OneToMany(() => SupplyItem, (items) => items.costDetail, {
    cascade: true,
  })
  items: Relation<SupplyItem[]>;

  @ManyToOne(() => Category)
  @JoinColumn()
  category: Relation<Category>;

  @ManyToOne(() => Project, { nullable: false, cascade: true })
  project: Relation<Project>;
}
