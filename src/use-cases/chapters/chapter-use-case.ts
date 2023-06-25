import { Module } from '@nestjs/common';
import { IChaptersRepository } from 'src/core/abstracts/';
import { Chapter } from 'src/core/entities';

@Module({})
export class ChapterUseCase implements IChaptersRepository {
  constructor(private readonly chaptersRepository: IChaptersRepository) {}

  getChapter(url: string): Promise<string[]> {
    return this.chaptersRepository.getChapter(url);
  }
  getChapters(mangaId: string): Promise<Chapter[]> {
    return this.chaptersRepository.getChapters(mangaId);
  }
}
