import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfessionalModule } from './professional/professional.module';
import { StaffModule } from './staff/staff.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({
		isGlobal: true,
		envFilePath: process.env.NODE_ENV === 'dev'
			? `.env.${process.env.NODE_ENV}`
			: '.env'
	}), ProfessionalModule, StaffModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
