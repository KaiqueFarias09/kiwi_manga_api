import { Module } from '@nestjs/common';
import { IMangasRepository } from 'src/core/abstracts/mangas/mangas-repostitory.abstract';
import { MangasServicesService } from './mangas-service.service';
import { MongoService } from '../mongo-prisma/mongo-prisma.service';
import { ImageAnalyzer } from 'src/utils/image-analyzer';

@Module({
  providers: [
    {
      provide: IMangasRepository,
      useClass: MangasServicesService,
    },
    MongoService,
    ImageAnalyzer,
  ],
  exports: [IMangasRepository],
})
export class MangasServicesModule {}
