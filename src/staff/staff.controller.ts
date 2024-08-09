import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateStaffDto } from './dtos/create-staff.dto';
import { StaffService } from './staff.service';
import { SearchQuerysStaff } from './dtos/searchQueryStaff';
import { Staff } from './entities/staff.entity';
import { UpdateStaffDto } from './dtos/update-staff.dto';

@Controller('staff')
export class StaffController {
  constructor(private staffService: StaffService) {}

  @Post()
  create(@Body() input: CreateStaffDto) {
    return this.staffService.create(input);
  }

  @Get()
  findAll(@Query() query: SearchQuerysStaff) {
    return query.name
      ? this.staffService.findByInput(query.name)
      : this.staffService.getAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseIntPipe()) id: Pick<Staff, 'id'>) {
    return this.staffService.findOne(id);
  }

  @Put(':id')
  update(@Body() input: UpdateStaffDto, @Param('id') id: Pick<Staff, 'id'>) {
    return this.staffService.update(input, id);
  }

  @Delete(':id')
  remove(@Param('id') id: Pick<Staff, 'id'>) {
    return this.staffService.delete(id);
  }
}
