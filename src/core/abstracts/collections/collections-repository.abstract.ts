import { Collection, MangaSimplified } from 'src/core/entities';

export abstract class ICollectionsRepository {
  abstract findCollections(userId: string): Promise<Collection[]>;
  abstract saveCollection(userId: string): Promise<Collection>;
  abstract deleteCollection(userId: string): Promise<Collection>;
  abstract updateCollection(
    updatedCollectionInfo: Collection,
  ): Promise<Collection>;

  abstract findCollectionMangas(
    collectionId: string,
  ): Promise<MangaSimplified[]>;
  abstract addMangaToCollection(collectionId: string): Promise<MangaSimplified>;
  abstract deleteMangaFromCollection(
    collectionId: string,
  ): Promise<MangaSimplified>;
}
