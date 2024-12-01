import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import constants from '../common/shared/constants';
import { ILike, Repository, SelectQueryBuilder } from 'typeorm';
import { Staff } from './entities/staff.entity';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';

@Injectable()
export class StaffService {
  private readonly logger = new Logger(StaffService.name);
  constructor(
    @Inject(constants.staff)
    private staffRepo: Repository<Staff>,
  ) {}

  private logQuery(query: SelectQueryBuilder<Staff>) {
    return process.env.NODE_ENV == 'dev' && this.logger.debug(query.getQuery());
  }

  private staffBaseQuery() {
    return this.staffRepo
      .createQueryBuilder('s')
      .orderBy('s.updatedAt', 'DESC');
  }

  public async create(input: CreateStaffDto) {
    if (
      await this.staffBaseQuery()
        .where('name = :name', { name: input.name })
        .getExists()
    )
      throw new BadRequestException('Esta profesión ya existe.');

    return await this.staffRepo.save({ ...input });
  }

  public async getAll() {
    const query = this.staffBaseQuery();
    this.logQuery(query);
    return query.getMany();
  }

  public async findByInput(value: string) {
    const query = this.staffBaseQuery().where({
      name: ILike(`%${value}%`),
    });
    this.logQuery(query);
    return await query.getMany();
  }

  public async findOne(id: number) {
    const query = this.staffBaseQuery().where('s.id = :id', { id });
    this.logQuery(query);
    return (
      (await query.getOne()) ??
      (() => {
        throw new NotFoundException('No se encontró el rol buscado');
      })()
    );
  }

  public async update(input: UpdateStaffDto, id: number) {
    const staff = await this.findOne(id);
    return await this.staffRepo.save({
      ...staff,
      ...input,
      name: input.name.toLocaleLowerCase(),
    });
  }

  public async delete(id: number) {
    const staff = await this.findOne(id);
    return await this.staffRepo.delete(staff);
  }
}
