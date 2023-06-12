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

@Module({
  imports: [
    HealthUseCaseModule,
    ChapterUseCaseModule,
    MangasUseCaseModule,
    AuthUseCasesModule,
  ],
  controllers: [
    HealthController,
    ChapterController,
    MangasController,
    AuthController,
  ],
})
export class AppModule {}
