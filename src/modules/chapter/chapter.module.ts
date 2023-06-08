import { Module } from '@nestjs/common';
import { ChapterController } from './controllers/chapter.controller';
import { ChapterService } from './services/chapter.service';

@Module({
  controllers: [ChapterController],
  providers: [ChapterService],
})
export class ChapterModule {}
