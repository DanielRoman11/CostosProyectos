import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import constants from '../common/shared/constants';
import { ILike, Repository } from 'typeorm';
import { Professional } from './entities/profesional.entity';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { StaffService } from '../staff/staff.service';
import { UpdateProfessionalDto } from './dto/update-professional.dto';

@Injectable()
export class ProfessionalService {
  private readonly logger = new Logger(ProfessionalService.name);
  constructor(
    @Inject(constants.professional)
    private professionalRepo: Repository<Professional>,
    private staffService: StaffService,
  ) {}

  private baseQuery() {
    return this.professionalRepo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.staff_type', 'staff')
      .orderBy('p.id', 'DESC');
  }

  public async createProfessional(
    input: CreateProfessionalDto,
  ): Promise<Professional> {
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

  public async findOne(id: Pick<Professional, 'id'>) {
    const query = this.baseQuery().where('id = :id', { id });
    this.logger.debug(query.getQuery());
    return await query.getOneOrFail();
  }

  public async updateProfessional(
    input: UpdateProfessionalDto,
    id: Pick<Professional, 'id'>,
  ): Promise<Professional> {
    const professional = await this.findOne(id);

    return await this.professionalRepo.save({
      ...professional,
      ...input,
      staff_id: input.staff_id
        ? await this.staffService.findOne(input.staff_id)
        : professional.staff_type,
    });
  }

  public async deleteProfessional(id: Pick<Professional, 'id'>) {
    const professional = await this.findOne(id);
    return await this.professionalRepo.delete(professional);
  }
}
