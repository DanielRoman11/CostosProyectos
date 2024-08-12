import { Module } from '@nestjs/common';
import { SuppliesService } from './supplies.service';
import { SuppliesController } from './supplies.controller';
import { SupplyProviders } from './supplies.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [...SupplyProviders, SuppliesService],
  controllers: [SuppliesController],
})
export class SuppliesModule {}
