import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { DatabaseModule } from '../database/database.module';
import { CategoryProvider } from './categories.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [CategoriesController],
  providers: [...CategoryProvider, CategoriesService],
  exports: [CategoriesService, ...CategoryProvider],
})
export class CategoriesModule {}
