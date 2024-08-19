import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { ProfessionalService } from './professional.service';
import { SearchQueryProfessional } from './dto/searchQueryProfessional';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { Professional } from './entities/profesional.entity';
import { ParseNumberOrUuidPipe } from '../common/pipes/parse-int-if-number.pipe';

@Controller('professional')
export class ProfessionalController {
  constructor(private professionalService: ProfessionalService) {}

  @Post()
  create(@Body() input: CreateProfessionalDto) {
    return this.professionalService.createProfessional(input);
  }

  @Get()
  findAll(@Query() input?: SearchQueryProfessional) {
    return input && input.name
      ? this.professionalService.findByInput(input.name)
      : this.professionalService.findAll();
  }

  @Get(':id')
  findProfessional(
    @Param('id', new ParseNumberOrUuidPipe()) id: Pick<Professional, 'id'>,
  ) {
    return this.professionalService.findOne(id);
  }

  @Patch(':id')
  update(
    @Body() input: UpdateProfessionalDto,
    @Param('id', new ParseNumberOrUuidPipe()) id: Pick<Professional, 'id'>,
  ) {
    return this.professionalService.updateProfessional(input, id);
  }

  @Delete(':id')
  delete(
    @Param('id', new ParseNumberOrUuidPipe()) id: Pick<Professional, 'id'>,
  ) {
    return this.professionalService.deleteProfessional(id);
  }
}
