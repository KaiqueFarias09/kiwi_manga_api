export abstract class IChaptersRepository {
  abstract getChapter(url: string): Promise<string[]>;

  abstract getChapters(mangaUrl: string): Promise<string[]>;
}
