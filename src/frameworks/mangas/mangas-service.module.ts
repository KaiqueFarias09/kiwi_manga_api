import { Module } from '@nestjs/common';
import { IMangasRepository } from '../../core/abstracts';
import { ImageAnalyzer } from '../../utils/image-analyzer';
import { MongoService } from '../mongo-prisma/mongo-prisma.service';
import { ScraperServiceService } from '../scraper/scraper-service.service';
import { MangasSearchService } from './mangas-search-service.service';
import { MangasServicesService } from './mangas-service.service';

@Module({
  providers: [
    {
      provide: IMangasRepository,
      useClass: MangasServicesService,
    },
    MongoService,
    ImageAnalyzer,
    MangasSearchService,
    ScraperServiceService,
  ],
  exports: [IMangasRepository],
})
export class MangasServicesModule {}
