import { Body, Controller, Get, Logger, Post, Query } from '@nestjs/common';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { ProfessionalService } from './professional.service';
import { SearchQueryProfessional } from './dto/searchQueryProfessional';

@Controller('profesional')
export class ProfessionalController {
  logger = new Logger(ProfessionalController.name);
  constructor(
		private professionalService: ProfessionalService
	) {}

  @Post()
  create(@Body() input: CreateProfessionalDto) {
		return this.professionalService.createProfessional(input)
	}

	@Get()
	findAll(@Query() input: SearchQueryProfessional){

	}
}
