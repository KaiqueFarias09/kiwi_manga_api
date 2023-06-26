import { Module } from '@nestjs/common';
import { MangaModule } from '../../services/mangas/manga.module';
import { MangasUseCase } from './mangas-use-case';

@Module({
  imports: [MangaModule],
  providers: [MangasUseCase],
  exports: [MangasUseCase],
})
export class MangasUseCaseModule {}
