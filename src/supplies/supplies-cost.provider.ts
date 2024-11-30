import { DataSource } from 'typeorm';
import constants from '../common/shared/constants';
import { SupplyCostDetails } from './entities/supply-cost-detail.entity';

export const SupplyCostProviders = [
  {
    provide: constants.supplies_cost,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(SupplyCostDetails),
    inject: [constants.dataSource],
  },
];
