import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../entity/User.js';
import { Config } from './index.js';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: Config.DB_HOST!,
  port: parseInt(Config.DB_PORT!, 10),
  username: Config.DB_USERNAME!,
  password: Config.DB_PASSWORD!,
  database: Config.DB_NAME!,
  //don't use this in production , always keep synchronize to false in production
  synchronize: false, //Config.NODE_ENV === 'test' || Config.NODE_ENV === 'dev',
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: [],
});
