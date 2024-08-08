import { Module } from '@nestjs/common';
import { ProfessionalController } from './professional.controller';
import { ProfessionalProvider } from './professional.provider';
import { StaffModule } from 'src/staff/staff.module';
import { DatabaseModule } from 'src/database/database.module';

@Module({
	imports: [DatabaseModule, StaffModule],
  providers: [...ProfessionalProvider],
  controllers: [ProfessionalController],
})
export class ProfessionalModule {}
