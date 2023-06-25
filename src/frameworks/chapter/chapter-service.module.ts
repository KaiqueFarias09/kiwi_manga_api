import { Module } from '@nestjs/common';
import { IChaptersRepository } from '../../core/abstracts';
import { MongoService } from '../mongo-prisma/mongo-prisma.service';
import { ChapterFrameworkService } from './chapter-service.service';

@Module({
  providers: [
    {
      provide: IChaptersRepository,
      useClass: ChapterFrameworkService,
    },
    MongoService,
  ],
  exports: [IChaptersRepository],
})
export class ChapterServiceModule {}
