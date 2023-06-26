import { Module } from '@nestjs/common';
import { ScoreUseCase } from './score-use-case';
import { ScoreModule } from '../../services/score/score.module';

@Module({
  imports: [ScoreModule],
  providers: [ScoreUseCase],
  exports: [ScoreUseCase],
})
export class ScoreUseCaseModule {}
