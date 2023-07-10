import { MangaSimplified } from './manga-simplified';

export class Combination {
  id: string;
  name: Languages;
  genres: number[];
  finalPage?: number;
  currentPage?: number;
  mangas?: MangaSimplified[];
}

class Languages {
  english: string;
  portuguese: string;
  german: string;
  french: string;
  spanish: string;
}
