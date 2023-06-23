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
import { ScoreUseCaseModule } from './use-cases/score';
import { ProfilePicModule } from './services/profile-pic/profile-pic.module';
import { CollectionsUseCaseModule } from './use-cases/collections';
import { FavoritesUseCaseModule } from './use-cases/favorites';

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
    ScoreUseCaseModule,
    ProfilePicModule,
    CollectionsUseCaseModule,
    FavoritesUseCaseModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
