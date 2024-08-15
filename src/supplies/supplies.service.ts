import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateSupplyDto } from './dto/create-supply.dto';
import { UpdateSupplyDto } from './dto/update-supply.dto';
import constants from '../common/shared/constants';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Supply } from './entities/supply.entity';
import { CategoriesService } from 'src/categories/categories.service';
import { SupplyCostDetails } from './entities/supply-cost-detail.entity';

@Injectable()
export class SuppliesService {
  private readonly logger = new Logger(SuppliesService.name);
  private logQuery(query: SelectQueryBuilder<Supply | SupplyCostDetails>) {
    return process.env.NODE_ENV == 'dev' && this.logger.debug(query.getQuery());
  }
  constructor(
    @Inject(constants.supplies)
    private supplyRepo: Repository<Supply>,
    private categoryService: CategoriesService,
  ) {}

  private baseQuery(): SelectQueryBuilder<Supply> {
    return this.supplyRepo
      .createQueryBuilder('sp')
      .orderBy('sp.id', 'DESC')
      .leftJoinAndSelect('sp.category_id', 'category');
  }

  public async create(input: CreateSupplyDto) {
    const clean_name = input.name.trim().toLocaleLowerCase();

    const [category, supplyExist] = await Promise.all([
      this.categoryService.findOne(input.category_id),
      this.findByExactInput(clean_name),
    ]);

    if (supplyExist)
      throw new BadRequestException('El nombre del suministro está en uso');

    return await this.supplyRepo.save({
      ...input,
      name: clean_name,
      description: input.description && input.description.trim(),
      category_id: category,
    });
  }

  async findAll() {
    const query = this.baseQuery();
    this.logger.debug(query.getQuery());
    return await query.getMany();
  }

  public async findOne(value: Pick<Supply, 'id'> | string) {
    const query = this.baseQuery();
    typeof value !== 'string'
      ? query.orWhere('sp.id = :id', { id: value })
      : query.orWhere('sp.name = :name', { name: value });
    this.logQuery(query);
    return (
      (await query.getOne()) ??
      (() => {
        throw new NotFoundException('No se encontró la categoría buscada');
      })()
    );
  }

  private async findByExactInput(search_value: string) {
    const query = this.baseQuery().where('sp.name = :name', {
      name: search_value,
    });
    this.logQuery(query);
    return await query.getOne();
  }

  async update(id: Pick<Supply, 'id'>, input: UpdateSupplyDto) {
    const supply = await this.findOne(id);
    const clean_name = input.name
      ? input.name.trim().toLocaleLowerCase()
      : supply.name;
    const clean_description = input.description
      ? input.description.trim()
      : supply.description;

    const isNameInUse = await this.findByExactInput(clean_name);
    if (isNameInUse && isNameInUse.name !== supply.name)
      throw new BadRequestException('Este nombre ya lo usa otro profesional');

    return await this.supplyRepo.save({
      ...supply,
      ...input,
      name: clean_name,
      description: clean_description,
      category_id: input.category_id
        ? await this.categoryService.findOne(input.category_id)
        : supply.category_id,
    });
  }

  async remove(id: Pick<Supply, 'id'>) {
    return await this.supplyRepo.delete(id);
  }
}
