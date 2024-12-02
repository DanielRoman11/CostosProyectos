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
import { CategoriesService } from '../categories/categories.service';
import { SupplyCostDetails } from './entities/supply-cost-detail.entity';
import { CreateSupplyCostDetailDto } from './dto/create-supply-cost.dto';
import { ProjectsService } from 'src/projects/projects.service';
import BigNumber from 'bignumber.js';

@Injectable()
export class SuppliesService {
  private readonly logger = new Logger(SuppliesService.name);
  private logQuery(query: SelectQueryBuilder<Supply | SupplyCostDetails>) {
    return process.env.NODE_ENV == 'dev' && this.logger.debug(query.getQuery());
  }
  constructor(
    @Inject(constants.supplies)
    private supplyRepo: Repository<Supply>,
    @Inject(constants.supplies_cost)
    private supplyCostRepo: Repository<SupplyCostDetails>,

    private categoryService: CategoriesService,
    private projectService: ProjectsService,
  ) {}

  private baseQuery(): SelectQueryBuilder<Supply> {
    return this.supplyRepo
      .createQueryBuilder('sp')
      .orderBy('sp.updatedAt', 'DESC');
  }

  public async create(input: CreateSupplyDto) {
    if (await this.findByExactInput(input.name))
      throw new BadRequestException('El nombre del suministro está en uso');

    return await this.supplyRepo.save({ ...input });
  }

  async findAll() {
    const query = this.baseQuery();
    this.logQuery(query);
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
    const query = this.baseQuery().where(`sp.name = :name`, {
      name: search_value,
    });
    this.logQuery(query);
    return await query.getOne();
  }

  async update(id: Pick<Supply, 'id'>, input: UpdateSupplyDto) {
    const supply = await this.findOne(id);

    const isNameInUse = input.name && (await this.findByExactInput(input.name));
    if (isNameInUse && isNameInUse.name !== supply.name)
      throw new BadRequestException('Este nombre ya lo usa otro profesional');

    return await this.supplyRepo.save({
      ...supply,
      ...input,
    });
  }

  async remove(id: Pick<Supply, 'id'>) {
    return await this.supplyRepo.delete(id);
  }

  private costBaseQuery() {
    return this.supplyCostRepo
      .createQueryBuilder('sc')
      .leftJoinAndSelect('sc.category', 'category')
      .leftJoinAndSelect('sc.items', 'items')
      .leftJoinAndSelect('items.supply', 'supply')
      .orderBy('sc.updatedAt', 'DESC');
  }

  public async findAllSupplyCost() {
    const query = this.costBaseQuery();
    this.logQuery(query);
    return await query.getMany();
  }

  public async findByIds(ids: Pick<Supply, 'id'>[]) {
    const query = this.baseQuery().whereInIds(ids);
    this.logQuery(query);
    return await query.getMany();
  }

  public async createSupplyCost(
    input: CreateSupplyCostDetailDto,
    project_id: string,
  ) {
    const supplies = await this.findByIds(
      input.items.map((item) => item.supply),
    );

    const foundSuppliesIds = new Set(supplies.map((supply) => supply.id));
    const missingsupplies = input.items
      .filter((item) => !foundSuppliesIds.has(item.supply.id))
      .map((item) => item.supply);

    missingsupplies.length > 0 &&
      (() => {
        throw new NotFoundException(
          `No se encontraron los siguientes suministros: ${missingsupplies.join(', ')}`,
        );
      })();

    const [project, category] = await Promise.all([
      this.projectService.findOne(project_id),
      this.categoryService.findOne(input.category_id),
    ]);

    const total_cost = supplies
      .reduce((total, supply) => {
        const unit_price = new BigNumber(supply.unit_price);
        const qty = new BigNumber(
          input.items.find((item) => item.supply.id === supply.id)?.quantity,
        );

        if (!qty) {
          throw new Error(
            `Cantidad no encontrada para el suministro con ID ${supply.id}`,
          );
        }

        return total.plus(unit_price.times(qty));
      }, new BigNumber(0))
      .toFixed(2);

    const supply_cost = await this.supplyCostRepo.save({
      unit: input.unit,
      total_cost,
      items: input.items,
      category,
      project,
    });

    console.log(supply_cost);

    await this.projectService
      .calculate_project_cost(project.id)
      .then(() => {
        console.log('Exito');
      })
      .catch((err) => {
        console.log('Falló!', err);
      });
  }
}
