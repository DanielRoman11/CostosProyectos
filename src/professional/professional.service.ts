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
import BigNumber from 'bignumber.js';

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
      .orderBy('p.updatedAt', 'DESC');
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
        : professional.staff,
    });
  }

  public async deleteProfessional(id: Pick<Professional, 'id'>) {
    return await this.professionalRepo.delete(id);
  }

  private costBaseQuery() {
    return this.professionalCostRepo
      .createQueryBuilder('pc')
      .leftJoinAndSelect('pc.items', 'items')
      .leftJoinAndSelect('items.professional', 'professional')
      .orderBy('pc.updatedAt', 'DESC');
  }

  public async createProfessionalCost(
    input: CreateProfessionalCostDetailDto,
    project_id: Pick<Project, 'id'>,
  ) {
    const professionals = await this.findByIds(
      input.items.map((item) => item.professional),
    );

    const foundProfessionalIds = new Set(professionals.map((prof) => prof.id));
    const missingProfessionals = input.items
      .filter((item: any) => !foundProfessionalIds.has(item.professional))
      .map((item) => item.professional);

    if (missingProfessionals.length > 0) {
      throw new NotFoundException(
        `No se encontraron los siguientes profesionales: ${missingProfessionals.join(', ')}`,
      );
    }
    const project = await this.projectService.findOne(project_id);

    const total_cost = professionals
      .reduce((total, prof) => {
        const unit_price = new BigNumber(prof.unit_price);
        const qty = new BigNumber(
          input.items.find(
            (item: any) => item.professional === prof.id,
          )?.quantity,
        );

        if (!qty) {
          throw new Error(
            `Cantidad no encontrada para el profesional con ID ${prof.id}`,
          );
        }

        return total.plus(unit_price.times(qty));
      }, new BigNumber(0))
      .toFixed(2);

    return await this.professionalCostRepo.save({
      ...input,
      project,
      total_cost,
      professionals,
    });
  }

  private calculate_professional_cost(
    cost_details: ProfessionalCostDetails,
  ): ProfessionalCostDetails {
    const cost_details_copy = structuredClone(cost_details);

    cost_details_copy.total_cost = cost_details_copy.items
      .reduce((total, items) => {
        const qty = new BigNumber(items.quantity);
        const professionalCost = new BigNumber(items.professional.unit_price);

        return total.plus(professionalCost.times(qty));
      }, new BigNumber(0))
      .toFixed(2);

    return cost_details_copy;
  }

  public async findAllProfessionalCost() {
    const query = this.costBaseQuery();
    this.logQuery(query);
    return await query.getMany();
  }

  public async findCostById(id: Pick<ProfessionalCostDetails, 'id'>) {
    const query = this.costBaseQuery().where('pc.id = :id', { id });
    this.logQuery(query);
    const cost_details =
      (await query.getOne()) ??
      (() => {
        throw new NotFoundException(
          'No se encontraron los costos de los detalles de profesionales',
        );
      })();

    const new_cost_details = this.calculate_professional_cost(cost_details);
    return new_cost_details.total_cost !== cost_details.total_cost
      ? await this.professionalCostRepo.save(new_cost_details)
      : cost_details;
  }
}
