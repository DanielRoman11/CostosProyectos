import {
  Entity,
  ManyToOne,
  Column,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Supply } from './supply.entity';
import { SupplyCostDetails } from './supply-cost-detail.entity';

@Entity()
export class SupplyItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Supply, { nullable: false, cascade: true })
  supply: Relation<Supply>;

  @ManyToOne(() => SupplyCostDetails, (costDetail) => costDetail.items, {
    nullable: false,
  })
  costDetail: Relation<SupplyCostDetails>;

  @Column('decimal')
  quantity: string;
}
