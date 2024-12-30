import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateSupplyCostDetailDto } from './dto/create-supply-cost.dto';
import { SuppliesService } from './supplies.service';
import { ParseNumberOrUuidPipe } from 'src/common/pipes/parse-int-if-number.pipe';
import { SupplyCostDetails } from './entities/supply-cost-detail.entity';
import UpdateSupplyCostDto from './dto/update-supply-cost.dto';

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

  @Patch(':project_id/:id')
  update(
    @Param('project_id', new ParseNumberOrUuidPipe()) project_id: string,
    @Param('id', new ParseNumberOrUuidPipe()) id: Pick<SupplyCostDetails, 'id'>,
    @Body() input: UpdateSupplyCostDto,
  ): Promise<SupplyCostDetails> {
    return this.supplyService.updateSupplyCost(input, id, project_id);
  }
}
