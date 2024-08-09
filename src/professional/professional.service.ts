import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import constants from '../shared/constants';
import { ILike, Repository } from 'typeorm';
import { Professional } from './entities/profesional.entity';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { StaffService } from 'src/staff/staff.service';

@Injectable()
export class ProfessionalService {
  private readonly logger = new Logger(ProfessionalService.name);
  constructor(
    @Inject(constants.professional)
    private professionalRepo: Repository<Professional>,
    private staffService: StaffService,
  ) {}

  private baseQuery() {
    return this.professionalRepo.createQueryBuilder('p');
  }

  public async createProfessional(input: CreateProfessionalDto) {
    const staff = await this.staffService.findOne(input.staff_id);
    if (!staff)
      throw new NotFoundException('No se encontró el tipo de personal');
    return await this.professionalRepo.save({ ...input, staff_id: staff });
  }

  public async findAll() {
    const query = this.baseQuery();
    this.logger.debug(query.getQuery());
    return await query.getMany();
  }

  public async findByInput(search_value: string) {
    const query = this.baseQuery().where({
      name: ILike(`%${search_value}%`),
    });
    this.logger.debug(query.getQuery());
    return await query.getMany();
  }

	
}
