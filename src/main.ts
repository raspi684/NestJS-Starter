import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { INestApplication, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port');
  const apiDocsEnabled = configService.get<boolean>('app.apiDocsEnabled');
  const apiDocsPath = configService.get<string>('app.apiDocsPath');

  if (apiDocsEnabled) {
    setupApiDocs({ apiDocsPath, app });
    logger.warn(`API docs are enabled and available on /${apiDocsPath}`);
  }

  await app.listen(port, () => logger.log(`App is listening on port ${port}`));
}

const setupApiDocs = ({
  apiDocsPath,
  app,
}: {
  apiDocsPath: string;
  app: INestApplication;
}) => {
  const config = new DocumentBuilder()
    .setTitle('HNT Watch')
    .setDescription('The HNT Watch API description')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(apiDocsPath, app, document);
};

bootstrap();
