import { Module } from '@nestjs/common';
import { ScraperServiceService } from './scraper-service.service';

@Module({
  providers: [ScraperServiceService],
  exports: [ScraperServiceService],
})
export class ScraperServiceModule {}
