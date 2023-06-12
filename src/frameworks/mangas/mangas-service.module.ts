import { Module } from '@nestjs/common';
import { IMangasRepository } from 'src/core/abstracts/mangas/mangas-repostitory.abstract';
import { MangasServicesService } from './mangas-service.service';

@Module({
  providers: [
    {
      provide: IMangasRepository,
      useClass: MangasServicesService,
    },
  ],
  exports: [IMangasRepository],
})
export class MangasServicesModule {}
