import {
  IsEnum,
  IsNotEmpty,
  Max,
  Min,
  ValidateNested,
  validateSync,
} from 'class-validator';
import { plainToClass, Type } from 'class-transformer';

export enum Environments {
  development = 'development',
  production = 'production',
}

class AppConfig {
  @Min(1)
  @Max(65535)
  port: number;

  @IsNotEmpty()
  @IsEnum(Environments)
  environment: Environments;
}

class DatabaseConfig {
  @IsNotEmpty()
  host: string;
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  database: string;
}

class Config {
  @ValidateNested()
  @Type(() => AppConfig)
  app: AppConfig;

  @ValidateNested()
  @Type(() => DatabaseConfig)
  database: DatabaseConfig;

  constructor(config: Config) {
    Object.assign(this, config);
  }

  /**
   * Create and validate config.
   * Nested property must be an instance of class otherwise validation won't be performed.
   */
  static create(data: Config) {
    const config = new Config(data);
    const errors = validateSync(config);
    if (errors.length) throw new Error(errors.toString());
    return config;
  }
}

export default () => {
  return Config.create({
    app: plainToClass(AppConfig, {
      port: parseInt(process.env.PORT),
      environment: process.env.NODE_ENV,
    }),
    database: plainToClass(DatabaseConfig, {
      host: process.env.POSTGRES_HOST,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
    }),
  });
};
