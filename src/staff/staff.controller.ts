import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateStaffDto } from './dtos/create-staff.dto';
import { StaffService } from './staff.service';
import { FindByInputStaffDto } from './dtos/findByInput-staff.dto';

@Controller('staff')
export class StaffController {
  constructor(private staffService: StaffService) {}

  @Post()
  create(@Body() input: CreateStaffDto) {
    return this.staffService.create(input);
  }

  @Patch()
  findAll(@Body() input: FindByInputStaffDto) {
    console.log(input);
    if (input) {
      return this.staffService.findByInput(input);
    }
    return this.staffService.getAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseIntPipe()) id: number) {
    return 'Uno Uno uno';
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `This action removes a #${id} cat`;
  }
}
