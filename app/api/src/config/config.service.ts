import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as Joi from '@hapi/joi';
import * as path from 'path';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default interface EnvConfig {
  [key: string]: string;
}

const keys = [
  'APP_PORT',
  'JWT_SECRET',
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

  public getTypeORMConfig(): TypeOrmModuleOptions {
    const isDevelopment = process.env.NODE_ENV !== 'production';
    const rootDir = isDevelopment ? 'src' : 'dist';
    const entitiesPath = path.join(
      __dirname,
      '../../',
      rootDir,
      '**/*.entity{.ts,.js}',
    );
    const migrationsPath = path.join(
      __dirname,
      '../../',
      rootDir,
      'database/migration/*{.ts,.js}',
    );
    return {
      type: this.envConfig.DB_CONNECTION as 'postgres',
      host: this.envConfig.DB_HOST,
      port: Number.parseInt(this.envConfig.DB_PORT, 10),
      username: this.envConfig.DB_USERNAME,
      password: this.envConfig.DB_PASSWORD,
      database: this.envConfig.DB_DATABASE,
      entities: [entitiesPath],
      migrations: [migrationsPath],
      cli: {
        migrationsDir: 'src/database/migration',
      },
      // migrationsRun: this.envConfig.DB_RUN === 'true',
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
