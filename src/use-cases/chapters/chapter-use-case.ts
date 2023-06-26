import { Module } from '@nestjs/common';
import { IChaptersRepository } from '../../core/abstracts/';
import { Chapter } from '../../core/entities';

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
