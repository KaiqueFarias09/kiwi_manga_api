import { Module } from '@nestjs/common';
import { ChapterUseCase } from './chapter-use-case';
import { ChapterModule } from 'src/services/chapters/chapter.module';

@Module({
  imports: [ChapterModule],
  providers: [ChapterUseCase],
  exports: [ChapterUseCase],
})
export class ChapterUseCaseModule {}
