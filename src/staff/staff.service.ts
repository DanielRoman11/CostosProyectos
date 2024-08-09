import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import constants from '../shared/constants';
import { Repository } from 'typeorm';
import { Staff } from './entities/staff.entity';
import { CreateStaffDto } from './dtos/create-staff.dto';
import { FindByInputStaffDto } from './dtos/findByInput-staff.dto';

@Injectable()
export class StaffService {
  private readonly logger = new Logger(StaffService.name);
  constructor(
    @Inject(constants.staff)
    private staffRepo: Repository<Staff>,
  ) {}

  private staffBaseQuery() {
    return this.staffRepo.createQueryBuilder('s');
  }

  public async create(input: CreateStaffDto) {
    if (
      await this.staffBaseQuery()
        .where('upper(name) = upper(:name)', { name: input.name })
        .getExists()
    )
      throw new BadRequestException('Esta profesión ya existe.');

    return await this.staffRepo.save({
      ...input,
      name: input.name.trim(),
    });
  }

  public async getAll() {
    return await this.staffRepo.find();
  }

  public async findByInput(input: FindByInputStaffDto) {
    const query = this.staffBaseQuery().where('upper(name)', {
      input: String(input.name).toUpperCase(),
    });

    this.logger.debug('Query ORM', query.getQuery());
    this.logger.debug('Query Response', query.getMany());

    return 'hola';
  }
}
