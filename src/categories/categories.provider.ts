import { DataSource } from 'typeorm';
import constants from '../common/shared/constants';
import { Category } from './entities/category.entity';

export const CategoryProvider = [
  {
    provide: constants.category,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Category),
    inject: [constants.dataSource],
  },
];
