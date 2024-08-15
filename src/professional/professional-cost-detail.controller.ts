import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { ProfessionalService } from './professional.service';
import { CreateProfessionalCostDetailDto } from './dto/create-professional-cost.dto';
import { ParseNumberOrUuidPipe } from '../common/pipes/parse-int-if-number.pipe';
import { ProfessionalCostDetails } from './entities/professional-cost-detail.entity';
import { Project } from '../projects/entities/project.entity';

@Controller('/cost/:project_id/professionals')
export class ProfessionalCostDetailController {
  constructor(private professionalService: ProfessionalService) {}

  @Post()
  create(
    @Param('project_id', new ParseNumberOrUuidPipe())
    project_id: Pick<Project, 'id'>,
    @Body() input: CreateProfessionalCostDetailDto,
  ) {
    return this.professionalService.createProfessionalCost(input, project_id);
  }

  @Get()
  findAll() {
    return this.professionalService.findCostForProfessionals();
  }

  @Get(':id')
  findOne(
    @Param('id', new ParseNumberOrUuidPipe())
    id: Pick<ProfessionalCostDetails, 'id'>,
  ) {
    return;
  }
}
