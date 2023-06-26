import { Injectable } from '@nestjs/common';
import { ICollectionsRepository } from '../../core/abstracts';
import {
  Collection,
  CollectionManga,
  WasDeletedEntity,
} from '../../core/entities';

@Injectable()
export class CollectionsUseCase {
  constructor(private readonly collectionsRepository: ICollectionsRepository) {}

  findCollections(userId: string): Promise<Collection[]> {
    return this.collectionsRepository.findCollections(userId);
  }
  saveCollection(
    userId: string,
    collectionInfo: Collection,
  ): Promise<Collection> {
    return this.collectionsRepository.saveCollection(userId, collectionInfo);
  }
  deleteCollection(collectionId: string): Promise<WasDeletedEntity> {
    return this.collectionsRepository.deleteCollection(collectionId);
  }
  updateCollection(updatedCollectionInfo: Collection): Promise<Collection> {
    return this.collectionsRepository.updateCollection(updatedCollectionInfo);
  }
  findCollectionMangas(collectionId: string): Promise<CollectionManga[]> {
    return this.collectionsRepository.findCollectionMangas(collectionId);
  }
  addMangaToCollection(
    collectionId: string,
    manga: CollectionManga,
  ): Promise<Collection> {
    return this.collectionsRepository.addMangaToCollection(collectionId, manga);
  }

  async deleteMangaFromCollection(
    collectionId: string,
    mangaId: string,
  ): Promise<WasDeletedEntity> {
    return this.collectionsRepository.deleteMangaFromCollection(
      collectionId,
      mangaId,
    );
  }
}
