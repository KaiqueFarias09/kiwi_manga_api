import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import helmet from 'helmet';
import { SwaggerTheme } from 'swagger-themes';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors();

  const theme = new SwaggerTheme('v3');
  const config = new DocumentBuilder()
    .setTitle('Kiwi API Documentation')
    .setDescription(' A API that provides programmatic access to manga data')
    .setVersion('1.0')
    .addApiKey({ type: 'apiKey', name: 'X-API-Key', in: 'header' }, 'X-API-Key')
    .addApiKey(
      {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
      },
      'Authorization',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);

  const customOptions: SwaggerCustomOptions = {
    customSiteTitle: 'Kiwi API',
    customCss: theme.getBuffer('dark'),
  };
  SwaggerModule.setup('docs', app, document, customOptions);

  await app.listen(process.env.PORT || 0, () => {
    console.log(
      `Server is listening on port ${
        process.env.PORT || app.getHttpServer().address().port
      }`,
    );
  });
}

bootstrap();
