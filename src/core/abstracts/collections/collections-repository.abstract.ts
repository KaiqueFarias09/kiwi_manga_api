import { Collection, CollectionManga, WasDeletedEntity } from '../../entities';

export abstract class ICollectionsRepository {
  abstract findCollections(userId: string): Promise<Collection[]>;
  abstract saveCollection(
    userId: string,
    collectionInfo: Collection,
  ): Promise<Collection>;
  abstract deleteCollection(collectionId: string): Promise<WasDeletedEntity>;
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
  ): Promise<WasDeletedEntity>;
}
