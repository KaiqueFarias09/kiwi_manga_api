import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Kiwi API Documentation')
    .setDescription(' A API that provides programmatic access to manga data')
    .setVersion('1.0')
    .addApiKey()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  const customOptions: SwaggerCustomOptions = {
    customSiteTitle: 'Kiwi API',
  };
  SwaggerModule.setup('docs', app, document, customOptions);

  await app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is listening on port ${process.env.PORT || 3000}`);
  });
}

bootstrap();
