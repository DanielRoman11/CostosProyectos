import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateSupplyCostDetailDto } from './dto/create-supply-cost.dto';
import { SuppliesService } from './supplies.service';
import { Project } from '../projects/entities/project.entity';
import { ParseNumberOrUuidPipe } from 'src/common/pipes/parse-int-if-number.pipe';
import { SupplyCostDetails } from './entities/supply-cost-detail.entity';

@Controller('/cost/supplies')
export class SuppliesCostDetailController {
  constructor(private supplyService: SuppliesService) {}

  @Post(':project_id')
  create(
    @Param('project_id', new ParseNumberOrUuidPipe())
    project_id: Pick<Project, 'id'>,
    @Body() input: CreateSupplyCostDetailDto,
  ) {
    return this.supplyService.createSupplyCost(input, project_id);
  }

  @Get()
  findAll() {
    return this.supplyService.findAllSupplyCost();
  }

  @Get(':id')
  findOne(
    @Param('id', new ParseNumberOrUuidPipe())
    id: Pick<SupplyCostDetails, 'id'>,
  ) {
    return this.supplyService.findCostById(id);
  }
}
