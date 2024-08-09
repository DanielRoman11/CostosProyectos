import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { ProfessionalService } from './professional.service';
import { SearchQueryProfessional } from './dto/searchQueryProfessional';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { Professional } from './entities/profesional.entity';

@Controller('professional')
export class ProfessionalController {
  logger = new Logger(ProfessionalController.name);
  constructor(private professionalService: ProfessionalService) {}

  @Post()
  create(@Body() input: CreateProfessionalDto) {
    return this.professionalService.createProfessional(input);
  }

  @Get()
  findAll(@Query() input?: SearchQueryProfessional) {
    return Object.keys(input).length > 0
      ? this.professionalService.findByInput(input.name)
      : this.professionalService.findAll();
  }

  @Get(':id')
  findProfessional(@Param() id: Pick<Professional, 'id'>) {
    return this.professionalService.findOne(id);
  }

  @Put(':id')
  update(
    @Body() input: UpdateProfessionalDto,
    @Param() id: Pick<Professional, 'id'>,
  ) {
    return this.professionalService.updateProfessional(input, id);
  }

  @Delete(':id')
  delete(@Param() id: Pick<Professional, 'id'>) {
    return this.professionalService.deleteProfessional(id);
  }
}
