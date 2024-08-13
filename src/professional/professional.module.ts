import { Module } from '@nestjs/common';
import { ProfessionalController } from './professional.controller';
import { ProfessionalProvider } from './professional.provider';
import { StaffModule } from '../staff/staff.module';
import { DatabaseModule } from '../database/database.module';
import { ProfessionalService } from './professional.service';
import { ProfessionalCostDetailController } from './professional-cost-detail.controller';
import { ProfessionalCostDetailProvider } from './professional-cost-detail.provider';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [DatabaseModule, StaffModule, ProjectsModule],
  providers: [
    ...ProfessionalProvider,
    ...ProfessionalCostDetailProvider,
    ProfessionalService,
  ],
  controllers: [ProfessionalController, ProfessionalCostDetailController],
})
export class ProfessionalModule {}
