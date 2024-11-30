import { ProfessionalCostDetails } from '../../professional/entities/professional-cost-detail.entity';
import { SupplyCostDetails } from '../../supplies/entities/supply-cost-detail.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('decimal', { nullable: true })
  budget: string;

  @Column('decimal', { nullable: true })
  total_cost: string;

  @OneToMany(() => ProfessionalCostDetails, (details) => details.project)
  professionalCostDetails: Relation<ProfessionalCostDetails[]>;

  @OneToMany(() => SupplyCostDetails, (details) => details.project)
  supplyCostDetails: Relation<SupplyCostDetails[]>;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deleteAt: Date;
}
