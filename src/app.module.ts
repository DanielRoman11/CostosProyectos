import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfessionalModule } from './professional/professional.module';
import { StaffModule } from './staff/staff.module';
import { ConfigModule } from '@nestjs/config';
import { SuppliesModule } from './supplies/supplies.module';
import { CategoriesModule } from './categories/categories.module';
import { ProjectsModule } from './projects/projects.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'dev'
          ? `.env.${process.env.NODE_ENV}`
          : '.env',
    }),
    ProfessionalModule,
    StaffModule,
    SuppliesModule,
    CategoriesModule,
    ProjectsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
