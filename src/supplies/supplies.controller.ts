import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SuppliesService } from './supplies.service';
import { CreateSupplyDto } from './dto/create-supply.dto';
import { UpdateSupplyDto } from './dto/update-supply.dto';
import { Supply } from './entities/supply.entity';
import { ParseIntIfNumberPipe } from '../common/pipes/parse-int-if-number.pipe';

@Controller('supplies')
export class SuppliesController {
  constructor(private readonly suppliesService: SuppliesService) {}

  @Post()
  create(@Body() createSupplyDto: CreateSupplyDto) {
    return this.suppliesService.create(createSupplyDto);
  }

  @Get()
  findAll() {
    return this.suppliesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseIntIfNumberPipe()) id: Pick<Supply, 'id'>) {
    return this.suppliesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseIntIfNumberPipe()) id: Pick<Supply, 'id'>,
    @Body() updateSupplyDto: UpdateSupplyDto,
  ) {
    return this.suppliesService.update(id, updateSupplyDto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseIntIfNumberPipe()) id: Pick<Supply, 'id'>) {
    return this.suppliesService.remove(id);
  }
}
