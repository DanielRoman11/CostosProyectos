import { Module } from '@nestjs/common';
import { StaffProvider } from './staff.provider';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [StaffController],
  providers: [...StaffProvider, StaffService],
  exports: [StaffService, ...StaffProvider],
})
export class StaffModule {}
