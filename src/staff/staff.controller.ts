import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';
import { StaffService } from './staff.service';
import { SearchQuerysStaff } from './dto/searchQueryStaff';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { ParseNumberOrUuidPipe } from '../common/pipes/parse-int-if-number.pipe';

@Controller('staff')
export class StaffController {
  constructor(private staffService: StaffService) {}

  @Post()
  create(@Body() input: CreateStaffDto) {
    return this.staffService.create(input);
  }

  @Get()
  findAll(@Query() query?: SearchQuerysStaff) {
    return query && query.name
      ? this.staffService.findByInput(query.name)
      : this.staffService.getAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseNumberOrUuidPipe()) id: number) {
    return this.staffService.findOne(id);
  }

  @Put(':id')
  update(
    @Body() input: UpdateStaffDto,
    @Param('id', new ParseNumberOrUuidPipe()) id: number,
  ) {
    return this.staffService.update(input, id);
  }

  @Delete(':id')
  remove(@Param('id', new ParseNumberOrUuidPipe()) id: number) {
    return this.staffService.delete(id);
  }
}
