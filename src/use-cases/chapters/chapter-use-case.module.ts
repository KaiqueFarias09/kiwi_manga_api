import { Module } from '@nestjs/common';
import { ChapterModule } from '../../services/chapters/chapter.module';
import { ChapterUseCase } from './chapter-use-case';

@Module({
  imports: [ChapterModule],
  providers: [ChapterUseCase],
  exports: [ChapterUseCase],
})
export class ChapterUseCaseModule {}
