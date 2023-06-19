import { Module } from '@nestjs/common';
import { IMangasRepository } from 'src/core/abstracts/mangas/mangas-repostitory.abstract';
import { MangasServicesService } from './mangas-service.service';
import { PrismaService } from '../prisma/prisma.service';
import { ImageComparer } from 'src/utils/image-comparer';

@Module({
  providers: [
    {
      provide: IMangasRepository,
      useClass: MangasServicesService,
    },
    PrismaService,
    ImageComparer,
  ],
  exports: [IMangasRepository],
})
export class MangasServicesModule {}
