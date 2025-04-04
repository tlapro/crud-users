import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { Role } from 'src/users/entities/role.entity';
import { User } from 'src/users/entities/users.entity';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({ path: '.env' });

const config = {
  type: 'postgres',
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  autoLoadEntities: true,
  synchronize: true,
  logging: ['errors'],
  entities: [User, Role],
  // dropSchema: true,
};
export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
