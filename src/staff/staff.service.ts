import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import constants from '../common/shared/constants';
import { ILike, Repository } from 'typeorm';
import { Staff } from './entities/staff.entity';
import { CreateStaffDto } from './dtos/create-staff.dto';
import { UpdateStaffDto } from './dtos/update-staff.dto';

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
    const clean_name = input.name.trim().toLocaleLowerCase();
    if (
      await this.staffBaseQuery()
        .where('name = :name', { name: clean_name })
        .getExists()
    )
      throw new BadRequestException('Esta profesión ya existe.');

    return await this.staffRepo.save({
      name: clean_name,
    });
  }

  public async getAll() {
    const query = this.staffBaseQuery();
    this.logger.debug(query.getQuery());
    return query.getMany();
  }

  public async findByInput(name: string) {
    const clean_name = name.trim().toLocaleLowerCase();
    const query = this.staffBaseQuery().where({
      name: ILike(`%${clean_name}%`),
    });
    this.logger.debug(query.getQuery());
    return await query.getMany();
  }

  public async findOne(id: Pick<Staff, 'id'>) {
    const query = this.staffBaseQuery().where('id = :id', { id });
    process.env.NODE_ENV == 'dev' && this.logger.debug(query.getQuery());
    return (
      (await query.getOne()) ??
      (() => {
        throw new NotFoundException('No se encontró el rol buscado');
      })()
    );
  }

  public async update(input: UpdateStaffDto, id: Pick<Staff, 'id'>) {
    const staff = await this.findOne(id);
    return await this.staffRepo.save({
      ...staff,
      ...input,
      name: input.name.toLocaleLowerCase(),
    });
  }

  public async delete(id: Pick<Staff, 'id'>) {
    const staff = await this.findOne(id);
    return await this.staffRepo.delete(staff);
  }
}
