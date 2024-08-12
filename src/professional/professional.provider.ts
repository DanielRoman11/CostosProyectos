import { DataSource } from 'typeorm';
import constants from '../common/shared/constants';
import { Professional } from './entities/profesional.entity';

export const ProfessionalProvider = [
  {
    provide: constants.professional,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(Professional),
    inject: [constants.dataSource],
  },
];
