import { Inject, Injectable, Logger } from '@nestjs/common';
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
      .leftJoinAndSelect(
        'pr.professionalCostDetails',
        'professionalCostDetail',
      );
  }

  public async create(input: CreateProjectDto) {
    return await this.projectRepo.save({ ...input });
  }

  public async findAll() {
    const query = this.baseQuery();
    this.logger.debug(query.getQuery());
    return await query.getMany();
  }

  public async findOne(id: Pick<Project, 'id'>) {
    const query = this.baseQuery().where('pr.id = :id', { id });
    this.logger.debug(query.getQuery());
    return await query.getOneOrFail();
  }

  update(id: Pick<Project, 'id'>, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  remove(id: Pick<Project, 'id'>) {
    return `This action removes a #${id} project`;
  }
}
