import { Chapter } from '../chapters';

export class Manga {
  name: string;
  url: string;
  cover: string;
  synopsis: string;
  genres: string[];
  status: string;
  lastUpdatedDate: string;
  chapters: Chapter[];
}
