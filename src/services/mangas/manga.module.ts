import { Module } from '@nestjs/common';
import { MangasServicesModule } from '../../frameworks/mangas/mangas-service.module';

@Module({
  imports: [MangasServicesModule],
  exports: [MangasServicesModule],
})
export class MangaModule {}
