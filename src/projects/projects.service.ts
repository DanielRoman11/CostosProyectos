import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import constants from '../common/shared/constants';
import { Repository } from 'typeorm';
import BigNumber from 'bignumber.js';

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);
  constructor(
    @Inject(constants.project)
    private projectRepo: Repository<Project>,
  ) {}

  private baseQuery() {
    return this.projectRepo
      .createQueryBuilder('pr')
      .orderBy('pr.updatedAt', 'DESC')
      .leftJoinAndSelect('pr.professionalCostDetails', 'professionalCostDetail')
      .leftJoinAndSelect('professionalCostDetail.items', 'professionalitem')
      .leftJoinAndSelect('professionalitem.professional', 'professional')
      .leftJoinAndSelect('pr.supplyCostDetails', 'supplyCostDetails')
      .leftJoinAndSelect('supplyCostDetails.items', 'supplyitem')
      .leftJoinAndSelect('supplyitem.supply', 'supply');
  }

  public async create(input: CreateProjectDto) {
    return await this.projectRepo.save({ ...input });
  }

  private async calculate_tota_cost(projects: Project[]) {
    return projects.map((project) => {
      const professional_cost = project.professionalCostDetails.reduce(
        (total, costDetail) => {
          return total.plus(new BigNumber(costDetail.total_cost));
        },
        new BigNumber(0),
      );
      console.log(professional_cost.toFixed(2));
      const supplies_cost = project.supplyCostDetails.reduce(
        (total, costDetail) => {
          console.log(
            'COSTOS PARA ',
            costDetail.category,
            costDetail.total_cost,
          );
          return total.plus(new BigNumber(costDetail.total_cost));
        },
        new BigNumber(0),
      );
      console.log(supplies_cost.toFixed(2));

      project.total_cost = professional_cost.plus(supplies_cost).toFixed(2);

      return project;
    });
  }

  public async findAll() {
    const query = this.baseQuery();
    this.logger.debug(query.getQuery());
    const projects = await query.getMany();
    const new_cost = await this.calculate_tota_cost(projects);
    return new_cost;
  }

  public async findOne(value: Pick<Project, 'id'> | string) {
    const query = this.baseQuery();
    const clean_value = value.toString().trim();
    typeof value !== 'string'
      ? (() => {
          throw new NotFoundException('No se encontró el proyecto buscado');
        })()
      : query.where('pr.id = :value::uuid', { value: clean_value });

    process.env.NODE_ENV == 'dev' && this.logger.debug(query.getQuery());
    return (
      (await query.getOne()) ??
      (() => {
        throw new NotFoundException('No se encontró el proyecto buscado');
      })()
    );
  }

  public async update(id: Pick<Project, 'id'>, input: UpdateProjectDto) {
    const project = await this.findOne(id);
    return await this.projectRepo.save({ ...project, ...input });
  }

  public async remove(id: Pick<Project, 'id'>) {
    return await this.projectRepo.softDelete(id);
  }
}
