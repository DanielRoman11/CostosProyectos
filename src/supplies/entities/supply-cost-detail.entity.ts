import { Entity, ManyToOne, Relation } from 'typeorm';
import { Supply } from './supply.entity';
import { CostDetail } from '../../common/shared/entities/cost-detail.entity';

@Entity()
export class SupplyCostDetails extends CostDetail {
  @ManyToOne(() => Supply, { nullable: false })
  supply: Relation<Supply>;
}
