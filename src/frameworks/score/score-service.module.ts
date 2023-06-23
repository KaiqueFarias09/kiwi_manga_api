import { Module } from '@nestjs/common';
import { IScoreRepository } from 'src/core/abstracts';
import { ScoreServiceService } from './score-serivce.service';
import { PostgresService } from '../postgres-prisma/postgres-prisma.service';

@Module({
  providers: [
    {
      provide: IScoreRepository,
      useClass: ScoreServiceService,
    },
    PostgresService,
  ],
  exports: [IScoreRepository],
})
export class ScoreServiceModule {}
