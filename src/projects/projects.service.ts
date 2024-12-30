import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import constants from '../common/shared/constants';
import BigNumber from 'bignumber.js';

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);
  constructor(
    @Inject(constants.project)
    private projectRepo: Repository<Project>,
  ) {}

  private logQuery(query: SelectQueryBuilder<Project>) {
    return process.env.NODE_ENV == 'dev' && this.logger.debug(query.getQuery());
  }

  private baseQuery() {
    return this.projectRepo
      .createQueryBuilder('pr')
      .orderBy('pr.updatedAt', 'DESC')
      .leftJoinAndSelect('pr.professionalCostDetails', 'pc')
      .leftJoinAndSelect('pc.items', 'pi')
      .leftJoinAndSelect('pi.professional', 'p')
      .leftJoinAndSelect('p.staff', 'st')
      .leftJoinAndSelect('pr.supplyCostDetails', 'sc')
      .leftJoinAndSelect('sc.category', 'category')
      .leftJoinAndSelect('sc.items', 'si')
      .leftJoinAndSelect('si.supply', 's');
  }

  public async create(input: CreateProjectDto) {
    process.env.NODE_ENV == 'dev' &&
      this.logger.debug('API CALL - project create');
    return await this.projectRepo.save({ ...input });
  }

  public async calculate_project_cost(
    project_id: string | Project,
  ): Promise<void> {
    const project: Project =
      typeof project_id !== 'string'
        ? structuredClone(project_id)
        : await this.findOne(project_id);

    const professional_cost = project.professionalCostDetails.reduce(
      (total, cost_details) => {
        return total.plus(new BigNumber(cost_details.total_cost));
      },
      new BigNumber(0),
    );

    const supplies_cost = project.supplyCostDetails.reduce(
      (total, cost_detail) => {
        return total.plus(new BigNumber(cost_detail.total_cost));
      },
      new BigNumber(0),
    );

    project.total_cost = professional_cost.plus(supplies_cost).toFixed(2);

    await this.projectRepo.save(project);
  }

  public async findAll() {
    const query = this.baseQuery();
    this.logQuery(query);
    return await query.getMany();
  }

  public async findOne(id: string | string) {
    const query = this.baseQuery().where('pr.id = :value::uuid', {
      value: id,
    });
    this.logQuery(query.select());

    return (
      (await query.select().getOne()) ??
      (() => {
        throw new NotFoundException('No se encontró el proyecto buscado');
      })()
    );
  }

  public async update(id: string, input: UpdateProjectDto) {
    const project = await this.findOne(id);
    await this.projectRepo.save({ ...project, ...input });
  }

  public async remove(id: string) {
    return await this.projectRepo.softDelete(id);
  }
}
