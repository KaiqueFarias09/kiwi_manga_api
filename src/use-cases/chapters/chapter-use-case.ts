import { Module } from '@nestjs/common';
import { IChaptersRepository } from 'src/core/abstracts/';

@Module({})
export class ChapterUseCase implements IChaptersRepository {
  constructor(private readonly chaptersRepository: IChaptersRepository) {}

  getChapter(url: string): Promise<string[]> {
    return this.chaptersRepository.getChapter(url);
  }
  getChapters(mangaUrl: string): Promise<string[]> {
    return this.chaptersRepository.getChapters(mangaUrl);
  }
}
