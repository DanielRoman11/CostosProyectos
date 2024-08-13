import { ProfessionalCostDetails } from '../../professional/entities/professional-cost-detail.entity';
import { SupplyCostDetails } from '../../supplies/entities/supply-cost-detail.entity';
import {
  Column,
  CreateDateColumn,
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

  @OneToMany(() => ProfessionalCostDetails, (details) => details.project)
  professionalCostDetails: Relation<ProfessionalCostDetails[]>;

  @OneToMany(() => SupplyCostDetails, (details) => details.project)
  supplyCostDetails: Relation<SupplyCostDetails[]>;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
