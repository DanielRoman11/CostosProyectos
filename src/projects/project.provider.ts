import { DataSource } from 'typeorm';
import constants from '../common/shared/constants';
import { Project } from './entities/project.entity';

export const ProjectProvider = [
  {
    provide: constants.project,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Project),
    inject: [constants.dataSource],
  },
];
