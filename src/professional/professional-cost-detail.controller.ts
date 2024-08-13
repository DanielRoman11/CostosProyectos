import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProfessionalService } from './professional.service';
import { CreateProfessionalCostDetailDto } from './dto/create-professional-cost.dto';

@Controller('/cost/professional')
export class ProfessionalCostDetailController {
  constructor(private professionalService: ProfessionalService) {}

  @Post()
  create(@Body() input: CreateProfessionalCostDetailDto) {
    return this.professionalService.createProfessionalCost(input);
  }

  @Get()
  findAll() {
    return this.professionalService.findAllProfessionalCost();
  }
}
