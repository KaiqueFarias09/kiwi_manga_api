import { Chapter } from '../chapters';

export class MangaEntity {
  id?: string;
  name: string;
  url: string;
  cover: string;
  synopsis: string;
  genres: string[];
  status: string;
  updatedAt: string;
  chapters: Chapter[];
  hasCover: boolean;
  source = 'novelcool';
}
