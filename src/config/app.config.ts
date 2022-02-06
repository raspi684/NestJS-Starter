import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  Max,
  Min,
  validateSync,
} from 'class-validator';
import { registerAs } from '@nestjs/config';

export enum Environments {
  development = 'development',
  production = 'production',
}

class AppConfig {
  @Min(1)
  @Max(65535)
  port = 3000;

  @IsNotEmpty()
  @IsEnum(Environments)
  environment: Environments = Environments.development;

  @IsNotEmpty()
  @IsBoolean()
  apiDocsEnabled = true;

  @IsNotEmpty()
  apiDocsPath = 'api-docs';

  constructor(config: AppConfig) {
    Object.assign(this, config);
  }

  /**
   * Create and validate config.
   * Nested property must be an instance of class otherwise validation won't be performed.
   */
  static create(data: AppConfig) {
    const config = new AppConfig(data);
    const errors = validateSync(config);
    if (errors.length) throw new Error(errors.toString());
    return config;
  }
}

export default registerAs('app', () => {
  return AppConfig.create({
    port: parseInt(process.env.PORT),
    environment: process.env.NODE_ENV as Environments,
    apiDocsEnabled: process.env.ENABLE_API_DOCS === 'true',
    apiDocsPath: process.env.API_DOCS_PATH,
  });
});
