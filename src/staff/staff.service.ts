import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import constants from '../shared/constants';
import { ILike, Repository } from 'typeorm';
import { Staff } from './entities/staff.entity';
import { CreateStaffDto } from './dtos/create-staff.dto';

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
        .where('name = :name', { name: input.name.toLocaleLowerCase() })
        .getExists()
    )
      throw new BadRequestException('Esta profesión ya existe.');

    return await this.staffRepo.save({
      name: input.name.toLocaleLowerCase().trim(),
    });
  }

  public async getAll() {
    const query = this.staffBaseQuery();
    this.logger.debug(query.getQuery());
    return query.getMany();
  }

  public async findByInput(name: string) {
    const query = this.staffBaseQuery().where({
      name: ILike(`%${name}%`),
    });
    this.logger.debug(query.getQuery());
    return await query.getMany();
  }

  public async findOne(id: Pick<Staff, 'id'>) {
    const query = this.staffBaseQuery().where('id = :id', { id });
    this.logger.debug(query.getQuery());
    return await query.getOneOrFail();
  }
}
