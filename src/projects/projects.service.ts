import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import constants from '../common/shared/constants';
import { Repository } from 'typeorm';

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
      .orderBy('pr.id', 'DESC')
      .leftJoinAndSelect('pr.professionalCostDetails', 'professionalCostDetail')
      .leftJoinAndSelect('pr.supplyCostDetails', 'supplyCostDetails');
  }

  public async create(input: CreateProjectDto) {
    return await this.projectRepo.save({ ...input });
  }

  public async findAll() {
    const query = this.baseQuery();
    this.logger.debug(query.getQuery());
    return await query.getMany();
  }

  public async findOne(value: Pick<Project, 'id'> | string) {
    const query = this.baseQuery();
    typeof value !== 'string'
      ? (() => {
          throw new NotFoundException('No se encontró el proyecto buscado');
        })()
      : query
          .where('pr.id = :value', { value })
          .orWhere('pr.name = :value', { value });

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
