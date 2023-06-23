import { Injectable } from '@nestjs/common';
import { ICollectionsRepository } from 'src/core/abstracts';
import { Collection, MangaSimplified } from 'src/core/entities';

@Injectable()
export class CollectionsServiceService implements ICollectionsRepository {
  findCollections(userId: string): Promise<Collection[]> {
    throw new Error('Method not implemented.');
  }
  saveCollection(userId: string): Promise<Collection> {
    throw new Error('Method not implemented.');
  }
  deleteCollection(userId: string): Promise<Collection> {
    throw new Error('Method not implemented.');
  }
  updateCollection(updatedCollectionInfo: Collection): Promise<Collection> {
    throw new Error('Method not implemented.');
  }
  findCollectionMangas(collectionId: string): Promise<MangaSimplified[]> {
    throw new Error('Method not implemented.');
  }
  addMangaToCollection(collectionId: string): Promise<MangaSimplified> {
    throw new Error('Method not implemented.');
  }
  deleteMangaFromCollection(collectionId: string): Promise<MangaSimplified> {
    throw new Error('Method not implemented.');
  }
}
