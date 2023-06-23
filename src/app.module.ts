import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import {
  AuthController,
  ChapterController,
  CollectionsController,
  FavoritesController,
  HealthController,
  MangasController,
  ProfilePicController,
  ScoreController,
} from './controllers';
import {
  AuthUseCasesModule,
  ChapterUseCaseModule,
  CollectionsUseCaseModule,
  FavoritesUseCaseModule,
  HealthUseCaseModule,
  MangasUseCaseModule,
  ProfilePicUseCaseModule,
  ScoreUseCaseModule,
} from './use-cases';

import { ConfigModule } from '@nestjs/config';
import { RequestLoggerMiddleware } from './middlewares/request-logger.middleware';

@Module({
  controllers: [
    HealthController,
    ChapterController,
    MangasController,
    AuthController,
    ScoreController,
    ProfilePicController,
    CollectionsController,
    FavoritesController,
  ],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HealthUseCaseModule,
    ChapterUseCaseModule,
    MangasUseCaseModule,
    AuthUseCasesModule,
    ScoreUseCaseModule,
    ProfilePicUseCaseModule,
    CollectionsUseCaseModule,
    FavoritesUseCaseModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
