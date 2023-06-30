import { Inject, Injectable, Logger } from '@nestjs/common';
import { ICollectionsRepository } from '../../core/abstracts';
import {
  AddMangaToCollectionResponseEntity,
  Collection,
  CollectionManga,
} from '../../core/entities';
import {
  DependentResourceNotFoundException,
  ResourceDoesNotExistException,
} from '../../core/errors';
import { PostgresService } from '../postgres-prisma/postgres-prisma.service';

@Injectable()
export class CollectionsServiceService implements ICollectionsRepository {
  postgresService: PostgresService;
  logger = new Logger('CollectionsServiceService');
  constructor(@Inject(PostgresService) postgresService: PostgresService) {
    this.postgresService = postgresService;
  }

  async findCollections(userId: string): Promise<Collection[]> {
    const data = await this.postgresService.collection.findMany({
      where: { userId: userId },
    });
    const collections: Collection[] = data.map((collection) => {
      return {
        description: collection.description,
        name: collection.name,
        id: collection.id,
      };
    });

    return collections;
  }

  async createCollection(
    userId: string,
    collectionInfo: Collection,
  ): Promise<Collection> {
    try {
      const newCollection = await this.postgresService.collection.create({
        data: {
          name: collectionInfo.name,
          description: collectionInfo.description,
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });

      return newCollection;
    } catch (error) {
      if (error.code === 'P2025')
        throw new DependentResourceNotFoundException();
    }
  }

  async deleteCollection(collectionId: string): Promise<void> {
    try {
      await this.postgresService.collection.delete({
        where: {
          id: collectionId,
        },
      });
    } catch (error) {
      if (error.code == 'P2025') throw new ResourceDoesNotExistException();
      throw error;
    }
  }

  async updateCollection({
    id,
    description,
    name,
  }: Collection): Promise<Collection> {
    try {
      const updatedCollection = await this.postgresService.collection.update({
        where: {
          id: id,
        },
        data: {
          description: description,
          name: name,
        },
      });

      return updatedCollection;
    } catch (error) {
      if (error.code == 'P2025') throw new ResourceDoesNotExistException();
      throw error;
    }
  }

  async findMangasFromCollection(
    collectionId: string,
  ): Promise<CollectionManga[]> {
    try {
      const collectionWithMangas =
        await this.postgresService.collection.findUnique({
          where: {
            id: collectionId,
          },
          include: {
            MangaCollection: {
              include: {
                manga: true,
              },
            },
          },
        });
      if (!collectionWithMangas) throw new ResourceDoesNotExistException();

      const mangas: CollectionManga[] =
        collectionWithMangas.MangaCollection.map((manga) => manga.manga);
      return mangas;
    } catch (error) {
      throw error;
    }
  }

  async addMangaToCollection(
    collectionId: string,
    manga: CollectionManga,
  ): Promise<AddMangaToCollectionResponseEntity> {
    try {
      const updatedCollection = await this.postgresService.collection.update({
        where: {
          id: collectionId,
        },
        data: {
          MangaCollection: {
            create: [
              {
                manga: {
                  connectOrCreate: {
                    where: {
                      id: manga.id,
                    },
                    create: {
                      cover: manga.cover,
                      synopsis: manga.synopsis,
                      name: manga.name,
                      id: manga.id,
                    },
                  },
                },
              },
            ],
          },
        },
      });

      return {
        collection: updatedCollection,
        manga: manga,
      };
    } catch (error) {
      if (error.code == 'P2025') throw new DependentResourceNotFoundException();
      throw error;
    }
  }

  async deleteMangaFromCollection(
    collectionId: string,
    mangaId: string,
  ): Promise<void> {
    try {
      await this.postgresService.collection.update({
        where: {
          id: collectionId,
        },
        data: {
          MangaCollection: {
            delete: {
              mangaId_collectionId: {
                mangaId: mangaId,
                collectionId: collectionId,
              },
            },
          },
        },
      });
    } catch (error) {
      if (error.code == 'P2017') throw new ResourceDoesNotExistException();
      throw error;
    }
  }
}
