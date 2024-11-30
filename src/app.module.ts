import { Module } from '@nestjs/common';
import { ProfessionalModule } from './professional/professional.module';
import { StaffModule } from './staff/staff.module';
import { ConfigModule } from '@nestjs/config';
import { SuppliesModule } from './supplies/supplies.module';
import { CategoriesModule } from './categories/categories.module';
import { ProjectsModule } from './projects/projects.module';
import { CommandRunnerModule } from 'nest-commander';
import { SeedService } from './seed.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    ProfessionalModule,
    StaffModule,
    SuppliesModule,
    CategoriesModule,
    ProjectsModule,
    CommandRunnerModule,
  ],
  providers: [SeedService],
})
export class AppModule {}
