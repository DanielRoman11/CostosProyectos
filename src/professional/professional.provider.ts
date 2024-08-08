import { DataSource } from 'typeorm';
import constants from '../shared/constants';
import { Professional } from './entities/profesional.entity';

export const attendeeProviders = [
  {
    provide: constants.professional,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Professional),
    inject: [constants.dataSource],
  },
];
