import { Module } from '@nestjs/common';
import { SuppliesService } from './supplies.service';
import { SuppliesController } from './supplies.controller';
import { SupplyProviders } from './supplies.providers';
import { DatabaseModule } from '../database/database.module';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
  imports: [DatabaseModule, CategoriesModule],
  providers: [...SupplyProviders, SuppliesService],
  controllers: [SuppliesController],
})
export class SuppliesModule {}
