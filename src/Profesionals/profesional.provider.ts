import { DataSource } from 'typeorm';
import constants from '../shared/constants';
import { Profesional } from './entities/profesional.entity';

export const attendeeProviders = [
  {
    provide: constants.profesional,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Profesional),
    inject: [constants.dataSource],
  },
];
