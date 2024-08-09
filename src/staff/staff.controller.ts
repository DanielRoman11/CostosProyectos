import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CreateStaffDto } from './dtos/create-staff.dto';
import { StaffService } from './staff.service';
import { FindByInputStaffDto } from './dtos/findByInput-staff.dto';
import { Staff } from './entities/staff.entity';

@Controller('staff')
export class StaffController {
  constructor(private staffService: StaffService) {}

  @Post()
  create(@Body() input: CreateStaffDto) {
    return this.staffService.create(input);
  }

  @Get()
  findAll(@Query() query: FindByInputStaffDto) {
    return query.name
      ? this.staffService.findByInput(query.name)
      : this.staffService.getAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseIntPipe()) id: Pick<Staff, 'id'>) {
    return this.staffService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `This action removes a #${id} cat`;
  }
}
