import { Injectable } from '@nestjs/common';
import { ICollectionsRepository } from '../../core/abstracts';
import {
  AddMangaToCollectionResponseEntity,
  Collection,
  CollectionManga,
} from '../../core/entities';

@Injectable()
export class CollectionsUseCase {
  constructor(private readonly collectionsRepository: ICollectionsRepository) {}

  findCollections(userId: string): Promise<Collection[]> {
    return this.collectionsRepository.findCollections(userId);
  }
  createCollection(
    userId: string,
    collectionInfo: Collection,
  ): Promise<Collection> {
    return this.collectionsRepository.createCollection(userId, collectionInfo);
  }
  async deleteCollection(collectionId: string): Promise<void> {
    await this.collectionsRepository.deleteCollection(collectionId);
  }
  updateCollection(updatedCollectionInfo: Collection): Promise<Collection> {
    return this.collectionsRepository.updateCollection(updatedCollectionInfo);
  }
  findCollectionMangas(collectionId: string): Promise<CollectionManga[]> {
    return this.collectionsRepository.findMangasFromCollection(collectionId);
  }
  addMangaToCollection(
    collectionId: string,
    manga: CollectionManga,
  ): Promise<AddMangaToCollectionResponseEntity> {
    return this.collectionsRepository.addMangaToCollection(collectionId, manga);
  }

  async deleteMangaFromCollection(
    collectionId: string,
    mangaId: string,
  ): Promise<void> {
    await this.collectionsRepository.deleteMangaFromCollection(
      collectionId,
      mangaId,
    );
  }
}
