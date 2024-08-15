import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import constants from '../common/shared/constants';
import { ILike, Repository, SelectQueryBuilder } from 'typeorm';
import { Professional } from './entities/profesional.entity';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { StaffService } from '../staff/staff.service';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { ProfessionalCostDetails } from './entities/professional-cost-detail.entity';
import { CreateProfessionalCostDetailDto } from './dto/create-professional-cost.dto';
import { ProjectsService } from '../projects/projects.service';
import { Project } from '../projects/entities/project.entity';

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
      .leftJoinAndSelect('p.staff_id', 'staff')
      .orderBy('p.id', 'DESC');
  }

  public async createProfessional(
    input: CreateProfessionalDto,
  ): Promise<Professional> {
    const clean_name = input.name.trim().toLocaleLowerCase();
    const staff = await this.staffService.findOne(input.staff_id);
    if (await this.findByExactInput(clean_name))
      throw new BadRequestException('Este nombre ya lo usa otro profesional');
    if (!staff)
      throw new NotFoundException('No se encontró el tipo de personal');
    return await this.professionalRepo.save({
      ...input,
      staff_id: staff,
      name: clean_name,
    });
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

  private async findByExactInput(search_value: string) {
    const query = this.baseQuery().where('p.name = :name', {
      name: search_value,
    });
    this.logQuery(query);
    return await query.getOne();
  }

  public async findOne(value: Pick<Professional, 'id'> | string) {
    const query = this.baseQuery();
    typeof value !== 'string'
      ? query.orWhere('p.id = :id', { id: value })
      : query.orWhere('p.name = :name', { name: value });
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
    const clean_name = input.name
      ? input.name.trim().toLocaleLowerCase()
      : professional.name;

    const isNameInUse = await this.findByExactInput(clean_name);
    if (isNameInUse && isNameInUse.name !== professional.name)
      throw new BadRequestException('Este nombre ya lo usa otro profesional');

    return await this.professionalRepo.save({
      ...professional,
      ...input,
      name: clean_name,
      staff_id: input.staff_id
        ? await this.staffService.findOne(input.staff_id)
        : professional.staff_id,
    });
  }

  public async deleteProfessional(id: Pick<Professional, 'id'>) {
    return await this.professionalRepo.delete(id);
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

  public async createProfessionalCost(input: CreateProfessionalCostDetailDto, project_id: Pick<Project, 'id'>) {
    const [professionals, project] = await Promise.all([
      this.findByIds(input.professionals.map(professional => professional.id)),
      this.projectService.findOne(project_id),
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
