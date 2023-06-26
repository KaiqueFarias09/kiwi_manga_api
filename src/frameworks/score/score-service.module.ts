import { Module } from '@nestjs/common';
import { IScoreRepository } from '../../core/abstracts';
import { PostgresService } from '../postgres-prisma/postgres-prisma.service';
import { ScoreServiceService } from './score-serivce.service';

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
