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

import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { ApiSecurity } from '@nestjs/swagger';
import { UsersController } from './controllers/users.controller';
import { MongoPrismaModule } from './frameworks/mongo-prisma/mongo-prisma.module';
import { PostgresPrismaModule } from './frameworks/postgres-prisma/postgres-prisma.module';
import { ScraperServiceModule } from './frameworks/scraper/scraper-service.module';
import { PasswordVerifierMiddleware } from './middlewares/password-verifier.middleware';
import { RequestLoggerMiddleware } from './middlewares/request-logger.middleware';
import { UsersUseCaseModule } from './use-cases/users';

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
    UsersController,
  ],
  imports: [
    CacheModule.register({
      isGlobal: true,
      host: 'localhost',
      port: 6379,
      store: 'redis',
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    HealthUseCaseModule,
    ChapterUseCaseModule,
    MangasUseCaseModule,
    AuthUseCasesModule,
    ScoreUseCaseModule,
    ProfilePicUseCaseModule,
    CollectionsUseCaseModule,
    FavoritesUseCaseModule,
    UsersUseCaseModule,
    PostgresPrismaModule,
    MongoPrismaModule,
    ScraperServiceModule,
  ],
})
@ApiSecurity('Authorization')
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
    consumer.apply(PasswordVerifierMiddleware).forRoutes('users');
  }
}
