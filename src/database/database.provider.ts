import constants from '../shared/constants';
import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: constants.dataSource,
    useFactory: async () => {
      try {
        const dataSource = new DataSource({
          type: 'postgres',
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT),
          username: 'daker',
          password: 'secret',
          database: 'soldadura',
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          synchronize: process.env.NODE_ENV === 'dev',
          dropSchema: process.env.NODE_ENV === 'test',
        });

        return await dataSource.initialize();
      } catch (error) {
        console.error('Database Connection Fails! ', error.message);
        throw error;
      }
    },
  },
];
