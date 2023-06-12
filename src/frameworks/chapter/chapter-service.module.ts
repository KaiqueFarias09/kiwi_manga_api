import { Module } from '@nestjs/common';
import { IChaptersRepository } from '../../core/abstracts';
import { ChapterFrameworkService } from './chapter-service.service';

@Module({
  providers: [
    {
      provide: IChaptersRepository,
      useClass: ChapterFrameworkService,
    },
  ],
  exports: [IChaptersRepository],
})
export class ChapterServiceModule {}
