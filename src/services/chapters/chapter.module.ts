import { Module } from '@nestjs/common';
import { ChapterServiceModule } from 'src/frameworks/chapter/chapter-service.module';

@Module({
  imports: [ChapterServiceModule],
  exports: [ChapterServiceModule],
})
export class ChapterModule {}
