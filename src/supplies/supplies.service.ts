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
import { Project } from '../projects/entities/project.entity';
import { ProjectsService } from 'src/projects/projects.service';
import BigNumber from 'bignumber.js';
import { CostDetail } from 'src/common/shared/entities/cost-detail.entity';

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
    const clean_name = input.name.trim().toLocaleLowerCase();

    if (await this.findByExactInput(clean_name))
      throw new BadRequestException('El nombre del suministro está en uso');

    return await this.supplyRepo.save({
      ...input,
      name: clean_name,
      description: input.description && input.description.trim(),
    });
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
    this.logger.debug(query.getQuery());
    const all = await query.getMany();
    return all.map((cost_details) => {
      return this.calculate_supply_cost(cost_details);
    });
  }

  public async findByIds(ids: Pick<Supply, 'id'>[]) {
    const query = this.baseQuery().whereInIds(ids);
    this.logQuery(query);
    return await query.getMany();
  }

  public async createSupplyCost(
    input: CreateSupplyCostDetailDto,
    project_id: Pick<Project, 'id'>,
  ) {
    const supplies = await this.findByIds(
      input.items.map((item) => item.supply),
    );

    const foundSuppliesIds = new Set(supplies.map((supply) => supply.id));
    const missingsupplies = input.items
      .filter((item: any) => !foundSuppliesIds.has(item.supply))
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
          input.items.find((item: any) => item.supply === supply.id)?.quantity,
        );

        if (!qty) {
          throw new Error(
            `Cantidad no encontrada para el suministro con ID ${supply.id}`,
          );
        }

        return total.plus(unit_price.times(qty));
      }, new BigNumber(0))
      .toFixed(2);

    return await this.supplyCostRepo.save({
      unit: input.unit,
      total_cost,
      items: input.items,
      category,
      project,
    });
  }

  private calculate_supply_cost(costDetail: SupplyCostDetails) {
    costDetail.total_cost = costDetail.items
      .reduce((total, item) => {
        const qty = new BigNumber(item.quantity);
        const unit_price = new BigNumber(item.supply.unit_price);
        return total.plus(unit_price.times(qty));
      }, new BigNumber(0))
      .toFixed(2);

    return costDetail;
  }

  public async findCostById(id: Pick<SupplyCostDetails, 'id'>) {
    const query = this.costBaseQuery().where('sc.id = :id', { id });
    this.logQuery(query);
    const cost_details =
      (await query.getOne()) ??
      (() => {
        throw new NotFoundException('No se encontró el suministro buscado');
      })();

    const new_cost_details = this.calculate_supply_cost(cost_details);

    return new_cost_details.total_cost === cost_details.total_cost
      ? cost_details
      : await this.supplyCostRepo.save(new_cost_details);
  }
}
