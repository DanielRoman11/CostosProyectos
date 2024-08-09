import { Module } from '@nestjs/common';
import { ProfessionalController } from './professional.controller';
import { ProfessionalProvider } from './professional.provider';
import { StaffModule } from '../staff/staff.module';
import { DatabaseModule } from '../database/database.module';
import { ProfessionalService } from './professional.service';

@Module({
  imports: [DatabaseModule, StaffModule],
  providers: [...ProfessionalProvider, ProfessionalService],
  controllers: [ProfessionalController],
})
export class ProfessionalModule {}
