import { DataSource } from 'typeorm';
import constants from '../shared/constants';
import { Supply } from './entities/supply.entity';

export const SupplyProviders = [
  {
    provide: constants.supplies,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Supply),
    inject: [constants.dataSource],
  },
];
