import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateSupplyCostDetailDto } from './dto/create-supply-cost.dto';
import { SuppliesService } from './supplies.service';
import { ParseNumberOrUuidPipe } from 'src/common/pipes/parse-int-if-number.pipe';
import { SupplyCostDetails } from './entities/supply-cost-detail.entity';

@Controller('/cost/supplies')
export class SuppliesCostDetailController {
  constructor(private supplyService: SuppliesService) {}

  @Post(':project_id')
  create(
    @Param('project_id', new ParseNumberOrUuidPipe())
    project_id: string,
    @Body() input: CreateSupplyCostDetailDto,
  ): Promise<SupplyCostDetails> {
    return this.supplyService.createSupplyCost(input, project_id);
  }

  @Get()
  findAll(): Promise<SupplyCostDetails[]> {
    return this.supplyService.findAllSupplyCost();
  }
}
