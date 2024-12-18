import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import constants from '../common/shared/constants';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);
  constructor(
    @Inject(constants.category)
    private categoryRepo: Repository<Category>,
  ) {}

  private logQuery(query: SelectQueryBuilder<Category>) {
    return process.env.NODE_ENV == 'dev' && this.logger.debug(query.getQuery());
  }

  private baseQuery(): SelectQueryBuilder<Category> {
    return this.categoryRepo.createQueryBuilder('c');
  }

  public async create(input: CreateCategoryDto) {
    if (await this.baseQuery().where({ name: input.name }).getOne())
      throw new BadRequestException('Esta categoria ya existe');
    return await this.categoryRepo.save({ ...input });
  }

  public async findAll() {
    const query = this.baseQuery();
    this.logQuery(query);
    return await query.getMany();
  }

  public async findOne(id: number) {
    const query = this.baseQuery().where('c.id = :id', { id });
    this.logQuery(query);
    return (
      (await query.getOne()) ??
      (() => {
        throw new NotFoundException('No se encontró la categoría buscada');
      })()
    );
  }

  public async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);
    return await this.categoryRepo.save({
      ...category,
      ...updateCategoryDto,
    });
  }

  public async remove(id: number) {
    return await this.categoryRepo.delete(id);
  }
}
