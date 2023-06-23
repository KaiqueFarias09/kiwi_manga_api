import { Module } from '@nestjs/common';
import { IScoreRepository } from 'src/core/abstracts';
import { ScoreServiceService } from './score-serivce.service';

@Module({
  providers: [
    {
      provide: IScoreRepository,
      useClass: ScoreServiceService,
    },
  ],
  exports: [IScoreRepository],
})
export class ScoreServiceModule {}
