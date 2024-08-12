import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateSupplyDto } from './dto/create-supply.dto';
import { UpdateSupplyDto } from './dto/update-supply.dto';
import constants from '../common/shared/constants';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Supply } from './entities/supply.entity';

@Injectable()
export class SuppliesService {
  private readonly logger = new Logger(SuppliesService.name);
  constructor(
    @Inject(constants.supplies)
    private supplyRepo: Repository<Supply>,
  ) {}

  private baseQuery(): SelectQueryBuilder<Supply> {
    return this.supplyRepo.createQueryBuilder('sp');
  }

  async create(createSupplyDto: CreateSupplyDto) {
    return await this.supplyRepo.save(createSupplyDto);
  }

  async findAll() {
    const query = this.baseQuery();
    this.logger.debug(query.getQuery());
    return await query.getMany();
  }

  async findOne(id: Pick<Supply, 'id'>) {
    const query = this.baseQuery().where('id = :id', { id });
    this.logger.debug(query.getQuery());
    return await query.getOneOrFail();
  }

  async update(id: Pick<Supply, 'id'>, updateSupplyDto: UpdateSupplyDto) {
    const supply = this.findOne(id);
    return await this.supplyRepo.save({
      ...supply,
      ...updateSupplyDto,
    });
  }

  async remove(id: Pick<Supply, 'id'>) {
    return await this.supplyRepo.delete(id);
  }
}
