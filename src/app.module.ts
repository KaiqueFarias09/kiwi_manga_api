import { Module } from '@nestjs/common';

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
export class AppModule {}
