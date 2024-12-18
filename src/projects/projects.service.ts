import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import constants from '../common/shared/constants';
import { Repository, SelectQueryBuilder } from 'typeorm';
import BigNumber from 'bignumber.js';
import { ProfessionalCostDetails } from '../professional/entities/professional-cost-detail.entity';
import { SupplyCostDetails } from '../supplies/entities/supply-cost-detail.entity';

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

  private minimalBaseQuery() {
    return this.projectRepo
      .createQueryBuilder('pr')
      .orderBy('pr.updatedAt', 'DESC');
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

  private calculate_total_cost(projects: Project[]) {
    return projects.reduce((total, project) => {
      const total_cost = new BigNumber(project.total_cost ?? 0);
      const final_cost = total.plus(total_cost);
      return final_cost;
    }, new BigNumber(0));
  }

  public async findProjectTotalCostInTime() {
    const query = this.minimalBaseQuery()
      .select(['pr.createdAt', 'pr.total_cost'])
      .where("pr.createdAt BETWEEN (NOW() - INTERVAL '1' YEAR) AND NOW()");

    const projects = await query.getMany();
    const now = new Date();

    const month = projects.filter((project) => {
      const createdAt = new Date(project.createdAt);
      const monthAgo = new Date(now);
      monthAgo.setMonth(now.getMonth() - 1);
      return createdAt >= monthAgo && createdAt <= now;
    });

    const week = projects.filter((project) => {
      const createdAt = new Date(project.createdAt);
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      return createdAt >= weekAgo && createdAt <= now;
    });

    const year_cost = this.calculate_total_cost(projects);
    const month_cost = this.calculate_total_cost(month);
    const week_cost = this.calculate_total_cost(week);

    return {
      year_cost,
      month_cost,
      week_cost,
    };
  }

  public async findAll() {
    const query = this.baseQuery();
    this.logQuery(query);
    return await query.getMany();
    // const calc_projects = await this.calculate_all_total_cost(projects);

    // return projects.every(
    //   (project) =>
    //     calc_projects.find((p) => p.id === project.id).total_cost ===
    //     project.total_cost,
    // )
    //   ? projects
    //   : await this.projectRepo.save(calc_projects);
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
