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
  'TYPEORM_CONNECTION',
  'TYPEORM_HOST',
  'TYPEORM_USERNAME',
  'TYPEORM_PASSWORD',
  'TYPEORM_DATABASE',
  'TYPEORM_PORT',
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
    const baseDir = path.join(__dirname, '../');
    const entitiesPath = `${baseDir}**/*.entity.js`;
    // const migrationPath = `${baseDir}${this.envConfig.TYPEORM_MIGRATIONS}`;
    const blah = {
      type: this.envConfig.TYPEORM_CONNECTION as 'postgres',
      host: this.envConfig.TYPEORM_HOST,
      port: Number.parseInt(this.envConfig.TYPEORM_PORT, 10),
      username: this.envConfig.TYPEORM_USERNAME,
      password: this.envConfig.TYPEORM_PASSWORD,
      database: this.envConfig.TYPEORM_DATABASE,
      entities: [entitiesPath],
      // migrations: [migrationPath],
      // migrationsRun: this.envConfig.TYPEORM_RUN === 'true',
      // cli: {
      //   migrationsDir: 'src/migrations',
      //   entitiesDir: 'src/**/*.entity.ts',
      // },
    };
    console.log('eggs', blah);
    return blah;
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
      APP_PORT: Joi.number().default('heel0'),
      TYPEORM_TYPE: Joi.string().valid('postgres').default('postgres'),
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
