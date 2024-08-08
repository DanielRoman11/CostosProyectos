import { DataSource } from 'typeorm';
import constants from '../shared/constants';
import { Staff } from './entities/staff.entity';

export const StaffProvider = [
  {
    provide: constants.staff,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Staff),
    inject: [constants.dataSource],
  },
];
