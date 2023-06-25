import { Chapter } from 'src/core/entities';

export abstract class IChaptersRepository {
  abstract getChapter(id: string): Promise<string[]>;
  abstract getChapters(mangaId: string): Promise<Chapter[]>;
}
