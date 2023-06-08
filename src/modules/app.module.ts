import { Module } from '@nestjs/common';
import { MangasModule } from './mangas/mangas.module';
import { MangaModule } from './manga/manga.module';
import { ChapterModule } from './chapter/chapter.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [MangasModule, MangaModule, ChapterModule, HealthModule],
})
export class AppModule {}
