import { Module } from '@nestjs/common';
import { ScoreServiceModule } from 'src/frameworks/score/score-service.module';

@Module({
  imports: [ScoreServiceModule],
  exports: [ScoreServiceModule],
})
export class ScoreModule {}
