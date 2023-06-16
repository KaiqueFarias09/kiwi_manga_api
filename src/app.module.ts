import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import {
  AuthController,
  ChapterController,
  HealthController,
  MangasController,
} from './controllers';
import {
  AuthUseCasesModule,
  ChapterUseCaseModule,
  HealthUseCaseModule,
  MangasUseCaseModule,
} from './use-cases';

import { ConfigModule } from '@nestjs/config';
import { RequestLoggerMiddleware } from './middlewares/request-logger.middleware';

@Module({
  controllers: [
    HealthController,
    ChapterController,
    MangasController,
    AuthController,
  ],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HealthUseCaseModule,
    ChapterUseCaseModule,
    MangasUseCaseModule,
    AuthUseCasesModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
