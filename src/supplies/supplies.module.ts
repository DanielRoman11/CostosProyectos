import { Module } from '@nestjs/common';
import { SuppliesService } from './supplies.service';
import { SuppliesController } from './supplies.controller';
import { SupplyProviders } from './supplies.providers';
import { DatabaseModule } from '../database/database.module';
import { CategoriesModule } from '../categories/categories.module';
import { SupplyCostProviders } from './supplies-cost.provider';
import { SuppliesCostDetailController } from './supplies-cost-details.controller';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [DatabaseModule, CategoriesModule, ProjectsModule],
  providers: [...SupplyProviders, ...SupplyCostProviders, SuppliesService],
  controllers: [SuppliesController, SuppliesCostDetailController],
  exports: [...SupplyProviders, ...SupplyCostProviders],
})
export class SuppliesModule {}
