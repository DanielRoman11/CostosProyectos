import { Inject, Injectable, Logger } from '@nestjs/common';
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

  private baseQuery(): SelectQueryBuilder<Category> {
    return this.categoryRepo.createQueryBuilder('c');
  }

  public async create(createCategoryDto: CreateCategoryDto) {
    return await this.categoryRepo.save(createCategoryDto);
  }

  public async findAll() {
    const query = this.baseQuery();
    this.logger.debug(query.getQuery());
    return await query.getMany();
  }

  public async findOne(id: Pick<Category, 'id'>) {
    const query = this.baseQuery().where('id = :id', { id });
    this.logger.debug(query.getQuery());
    return await query.getOneOrFail();
  }

  public async update(
    id: Pick<Category, 'id'>,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    const category = this.findOne(id);
    return await this.categoryRepo.save({
      ...category,
      ...updateCategoryDto,
    });
  }

  public async remove(id: Pick<Category, 'id'>) {
    return await this.categoryRepo.delete(id);
  }
}
