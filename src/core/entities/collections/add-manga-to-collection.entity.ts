import { Collection } from './collection';
import { CollectionManga } from './collection-manga.entity';

export class AddMangaToCollectionResponseEntity {
  manga: CollectionManga;
  collection: Collection;
}
