import { Module } from '@nestjs/common';
import { MangasUseCase } from './mangas-use-case';
import { MangaModule } from 'src/services/mangas/manga.module';

@Module({
  imports: [MangaModule],
  providers: [MangasUseCase],
  exports: [MangasUseCase],
})
export class MangasUseCaseModule {}
