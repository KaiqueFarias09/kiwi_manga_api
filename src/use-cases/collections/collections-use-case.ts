import { Injectable } from '@nestjs/common';
import { ICollectionsRepository } from 'src/core/abstracts';
import { Collection, MangaSimplified } from 'src/core/entities';

@Injectable()
export class CollectionsUseCase {
  constructor(private readonly collectionsRepository: ICollectionsRepository) {}

  findCollections(userId: string): Promise<Collection[]> {
    return this.collectionsRepository.findCollections(userId);
  }
  saveCollection(userId: string): Promise<Collection> {
    return this.collectionsRepository.saveCollection(userId);
  }
  deleteCollection(userId: string): Promise<Collection> {
    return this.collectionsRepository.deleteCollection(userId);
  }
  updateCollection(updatedCollectionInfo: Collection): Promise<Collection> {
    return this.collectionsRepository.updateCollection(updatedCollectionInfo);
  }
  findCollectionMangas(collectionId: string): Promise<MangaSimplified[]> {
    return this.collectionsRepository.findCollectionMangas(collectionId);
  }
  addMangaToCollection(collectionId: string): Promise<MangaSimplified> {
    return this.collectionsRepository.addMangaToCollection(collectionId);
  }
  deleteMangaFromCollection(collectionId: string): Promise<MangaSimplified> {
    return this.collectionsRepository.deleteMangaFromCollection(collectionId);
  }
}
