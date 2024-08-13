import { DataSource } from 'typeorm';
import constants from '../common/shared/constants';
import { ProfessionalCostDetails } from './entities/professional-cost-detail.entity';

export const ProfessionalCostDetailProvider = [
  {
    provide: constants.professional_cost,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ProfessionalCostDetails),
    inject: [constants.dataSource],
  },
];
