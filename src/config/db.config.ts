import { registerAs } from '@nestjs/config';
import { IsBoolean, IsNotEmpty, validateSync } from 'class-validator';
import { join } from 'path';
import { ConnectionOptions } from 'typeorm';

class DatabaseConfig {
  @IsNotEmpty()
  host: string;
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  database: string;
  @IsBoolean()
  logging = true;
  @IsBoolean()
  migrationsRun = true;

  constructor(config: DatabaseConfig) {
    Object.assign(this, config);
  }

  /**
   * Create and validate config.
   * Nested property must be an instance of class otherwise validation won't be performed.
   */
  static create(data: DatabaseConfig) {
    const config = new DatabaseConfig(data);
    const errors = validateSync(config);
    if (errors.length) throw new Error(errors.toString());
    return config;
  }
}

export default registerAs('database', () => {
  const validatedConfig = DatabaseConfig.create({
    host: process.env.POSTGRES_HOST,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    logging: process.env.ORM_LOGGING === 'true',
    migrationsRun: process.env.ORM_RUN_MIGRATIONS === 'true',
  });
  return {
    ...validatedConfig,
    type: 'postgres',
    port: 5432,
    entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
    migrations: [join(__dirname, '..', 'migrations', '*{.ts,.js}')],
    cli: {
      migrationsDir: 'src/migrations',
    },
  } as ConnectionOptions;
});
