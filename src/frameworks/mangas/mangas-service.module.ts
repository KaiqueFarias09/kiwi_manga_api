import { Module } from '@nestjs/common';
import { IMangasRepository } from 'src/core/abstracts/mangas/mangas-repostitory.abstract';
import { MangasServicesService } from './mangas-service.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [
    {
      provide: IMangasRepository,
      useClass: MangasServicesService,
    },
    PrismaService,
  ],
  exports: [IMangasRepository],
})
export class MangasServicesModule {}
