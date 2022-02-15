import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as Sentry from '@sentry/node';
import { Integrations as TracingIntegrations } from '@sentry/tracing';
import { SentryInterceptor } from './common/interceptors/sentry.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const port = configService.get<number>('app.port');
  const apiDocsEnabled = configService.get<boolean>('app.apiDocsEnabled');
  const apiDocsPath = configService.get<string>('app.apiDocsPath');
  const sentryDsn = configService.get('app.sentryDsn');

  if (apiDocsEnabled) {
    const config = new DocumentBuilder()
      .setTitle('HNT Watch')
      .setDescription('The HNT Watch API description')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(apiDocsPath, app, document);
    logger.warn(`API docs are enabled and available on /${apiDocsPath}`);
  }

  if (sentryDsn) {
    logger.log('Sentry is enabled');
    Sentry.init({
      dsn: sentryDsn,
      environment: configService.get('app.environment'),
      attachStacktrace: true,
      integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new TracingIntegrations.Express(),
        new TracingIntegrations.Postgres(),
      ],
    });
    app.useGlobalInterceptors(new SentryInterceptor());
  }

  await app.listen(port, () => logger.log(`App is listening on port ${port}`));
}

bootstrap();
