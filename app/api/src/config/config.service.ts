import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as Joi from '@hapi/joi';
import * as path from 'path';
import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';

export default interface EnvConfig {
  [key: string]: string;
}

const keys = [
  'APP_PORT',
  'JWT_ACCESS_TOKEN_SECRET',
  'JWT_ACCESS_TOKEN_EXPIRATION',
  'JWT_REFRESH_TOKEN_SECRET',
  'JWT_REFRESH_TOKEN_EXPIRATION',
  'DB_CONNECTION',
  'DB_HOST',
  'DB_USERNAME',
  'DB_PASSWORD',
  'DB_DATABASE',
  'DB_PORT',
];

@Injectable()
export class ConfigService {
  private readonly envConfig: EnvConfig;

  public constructor() {
    this.envConfig = this.initializeConfig();
  }

  public get(key: string): string {
    return this.envConfig[key];
  }

  public getMikroOrmConfig(): MikroOrmModuleOptions {
    const entities = path.join('./dist', '**/*.entity{.ts,.js}');
    const entitiesTs = path.join('./src', '**/*.entity{.ts,.js}');
    const migrationPath = path.join('./src', 'database/migration');
    console.log('eggs', entitiesTs, entities, migrationPath);

    return {
      type: this.envConfig.DB_CONNECTION as 'postgresql',
      host: this.envConfig.DB_HOST,
      port: Number.parseInt(this.envConfig.DB_PORT, 10),
      user: this.envConfig.DB_USERNAME,
      password: this.envConfig.DB_PASSWORD,
      dbName: this.envConfig.DB_DATABASE,
      entities: [entities],
      entitiesTs: [entitiesTs],
      migrations: {
        tableName: 'mikro_orm_migrations', // name of database table with log of executed transactions
        path: migrationPath, // path to the folder with migrations
        // pattern: /^[\w-]+\d+\.ts$/, // regex pattern for the migration files
        transactional: true, // wrap each migration in a transaction
        disableForeignKeys: true, // wrap statements with `set foreign_key_checks = 0` or equivalent
        allOrNothing: true, // wrap all migrations in master transaction
        dropTables: true, // allow to disable table dropping
        safe: false, // allow to disable table and column dropping
        emit: 'ts', // migration generation mode
      },
    };
  }

  private initializeConfig(): EnvConfig {
    const env = process.env.NODE_ENV || 'development';
    if (env !== 'production') {
      dotenv.config();
    }
    const rawConfig = this.getRawConfigFromEnv();
    return this.validateRawConfig(rawConfig);
  }

  private getRawConfigFromEnv() {
    const rawConfig: { [key: string]: string | undefined } = {};
    keys.forEach((key) => {
      rawConfig[key] = process.env[key];
    });
    return rawConfig;
  }

  private validateRawConfig(rawConfig: {
    [key: string]: string | undefined;
  }): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string()
        .valid('development', 'test')
        .default('development'),
      APP_PORT: Joi.number().default(3001),
      DB_TYPE: Joi.string().valid('postgres').default('postgres'),
      DB_PORT: Joi.number().default(54320),
      JWT_ACCESS_TOKEN_EXPIRATION: Joi.string().required(),
      JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
      JWT_REFRESH_TOKEN_EXPIRATION: Joi.string().required(),
      JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
    }).unknown(true);
    const { error, value: validatedEnvConfig } = envVarsSchema.validate(
      rawConfig,
    );
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }
}

export const configService = new ConfigService();
