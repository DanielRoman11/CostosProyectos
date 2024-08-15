import { DataSource } from 'typeorm';
import constants from '../common/shared/constants';
import { ProfessionalItem } from './entities/professional-item.entity';

export const ProfessionalItemProvider = [
  {
    provide: constants.professional_item,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ProfessionalItem),
    inject: [constants.dataSource],
  },
];
