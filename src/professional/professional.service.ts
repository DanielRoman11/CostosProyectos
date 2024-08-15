import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import constants from '../common/shared/constants';
import { ILike, Repository, SelectQueryBuilder } from 'typeorm';
import { Professional } from './entities/profesional.entity';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { StaffService } from '../staff/staff.service';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { ProfessionalCostDetails } from './entities/professional-cost-detail.entity';
import { CreateProfessionalCostDetailDto } from './dto/create-professional-cost.dto';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class ProfessionalService {
  private readonly logger = new Logger(ProfessionalService.name);

  constructor(
    @Inject(constants.professional)
    private professionalRepo: Repository<Professional>,
    @Inject(constants.professional_cost)
    private professionalCostRepo: Repository<ProfessionalCostDetails>,

    private staffService: StaffService,
    private projectService: ProjectsService,
  ) {}

  private logQuery(
    query: SelectQueryBuilder<Professional | ProfessionalCostDetails>,
  ) {
    return process.env.NODE_ENV == 'dev' && this.logger.debug(query.getQuery());
  }

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
    this.logQuery(query);
    return await query.getMany();
  }

  public async findByInput(search_value: string) {
    const query = this.baseQuery().where({
      name: ILike(`%${search_value}%`),
    });
    this.logQuery(query);
    return await query.getMany();
  }

  public async findOne(id: Pick<Professional, 'id'>) {
    const query = this.baseQuery().where('id = :id', { id });
    this.logQuery(query);
    return (
      (await query.getOne()) ??
      (() => {
        throw new NotFoundException('No se encontró el profesional buscado');
      })()
    );
  }

  public async findByIds(ids: Pick<Professional, 'id'>[]) {
    const query = this.baseQuery().whereInIds(ids);
    this.logQuery(query);
    return await query.getMany();
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

  private costBaseQuery() {
    return this.professionalCostRepo
      .createQueryBuilder('pc')
      .orderBy('pc.id', 'DESC');
  }

  private findCostBaseQuery(): SelectQueryBuilder<ProfessionalCostDetails> {
    return this.costBaseQuery()
      .orderBy('pc.id', 'DESC')
      .leftJoinAndSelect('pc.professionals', 'professional');
  }

  public async findCostForProfessionals() {
    const query = this.findCostBaseQuery();
    this.logQuery(query);
    return await query.getMany();
  }

  public async findCostBaseQueryById(id: Pick<ProfessionalCostDetails, 'id'>) {
    const query = this.findCostBaseQuery().where('pro.id = :id', { id });
    this.logQuery(query);
    return (
      (await query.getOne()) ??
      (() => {
        throw new NotFoundException('No se encontró  buscada');
      })()
    );
  }

  public async createProfessionalCost(input: CreateProfessionalCostDetailDto) {
    const [professionals, project] = await Promise.all([
      this.findByIds(input.professional_ids),
      this.projectService.findOne(input.project),
    ]);

    const total_cost = professionals
      .reduce((total, prof) => {
        const unitPrice = parseFloat(prof.unit_price);
        const qty = parseFloat(input.quantity);
        return total + unitPrice * qty;
      }, 0)
      .toFixed(2);

    return await this.professionalCostRepo.save({
      ...input,
      project,
      professionals,
      total_cost,
    });
  }
}
