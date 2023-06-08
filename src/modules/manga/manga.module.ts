import { Module } from '@nestjs/common';
import { MangaService as MangaService } from './services/manga.service';
import { MangaController } from './controllers/manga.controller';

@Module({
  providers: [MangaService],
  controllers: [MangaController],
})
export class MangaModule {}
