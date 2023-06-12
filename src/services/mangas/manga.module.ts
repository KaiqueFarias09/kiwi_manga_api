import { Module } from '@nestjs/common';
import { MangasServicesModule } from 'src/frameworks/mangas/mangas-service.module';

@Module({
  imports: [MangasServicesModule],
  exports: [MangasServicesModule],
})
export class MangaModule {}
