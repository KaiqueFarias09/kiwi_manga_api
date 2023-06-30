import { Collection, CollectionManga, WasDeletedEntity } from '../../entities';

export abstract class ICollectionsRepository {
  abstract findCollections(userId: string): Promise<Collection[]>;
  abstract addCollection(
    userId: string,
    collectionInfo: Collection,
  ): Promise<Collection>;
  abstract deleteCollection(collectionId: string): Promise<WasDeletedEntity>;
  abstract updateCollection(
    updatedCollectionInfo: Collection,
  ): Promise<Collection>;

  abstract findMangasFromCollection(
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
