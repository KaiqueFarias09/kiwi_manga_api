import {
  AddMangaToCollectionResponseEntity,
  Collection,
  CollectionManga,
} from '../../entities';

export abstract class ICollectionsRepository {
  abstract findCollections(userId: string): Promise<Collection[]>;

  abstract createCollection(
    userId: string,
    collectionInfo: Collection,
  ): Promise<Collection>;

  abstract deleteCollection(collectionId: string): Promise<void>;

  abstract updateCollection(
    updatedCollectionInfo: Collection,
  ): Promise<Collection>;

  abstract findMangasFromCollection(
    collectionId: string,
  ): Promise<CollectionManga[]>;

  abstract addMangaToCollection(
    collectionId: string,
    manga: CollectionManga,
  ): Promise<AddMangaToCollectionResponseEntity>;

  abstract deleteMangaFromCollection(
    collectionId: string,
    mangaId: string,
  ): Promise<void>;
}
