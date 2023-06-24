import { Collection, CollectionManga } from 'src/core/entities';

export abstract class ICollectionsRepository {
  abstract findCollections(userId: string): Promise<Collection[]>;
  abstract saveCollection(
    userId: string,
    collectionInfo: Collection,
  ): Promise<Collection>;
  abstract deleteCollection(collectionId: string): Promise<Collection>;
  abstract updateCollection(
    updatedCollectionInfo: Collection,
  ): Promise<Collection>;

  abstract findCollectionMangas(
    collectionId: string,
  ): Promise<CollectionManga[]>;
  abstract addMangaToCollection(
    collectionId: string,
    manga: CollectionManga,
  ): Promise<Collection>;
  abstract deleteMangaFromCollection(
    collectionId: string,
    mangaId: string,
  ): Promise<Collection>;
}
