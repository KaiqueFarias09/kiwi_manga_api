import { Module } from '@nestjs/common';
import { ImageAnalyzer } from '../../utils/image-analyzer';
import { IMangasRepository } from '../../core/abstracts';
import { MongoService } from '../mongo-prisma/mongo-prisma.service';
import { MangasServicesService } from './mangas-service.service';

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
