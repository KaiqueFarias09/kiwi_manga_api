import { Inject, Injectable, Logger } from '@nestjs/common';
import { ICollectionsRepository } from 'src/core/abstracts';
import {
  Collection,
  CollectionManga,
  WasDeletedEntity,
} from 'src/core/entities';
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

  async saveCollection(
    userId: string,
    collectionInfo: Collection,
  ): Promise<Collection> {
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
  }

  async deleteCollection(collectionId: string): Promise<WasDeletedEntity> {
    try {
      await this.postgresService.collection.delete({
        where: {
          id: collectionId,
        },
      });

      return {
        deleted: true,
      };
    } catch (error) {
      this.logger.error(error);
      return {
        deleted: false,
      };
    }
  }

  async updateCollection({
    id,
    description,
    name,
  }: Collection): Promise<Collection> {
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
  }

  async findCollectionMangas(collectionId: string): Promise<CollectionManga[]> {
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

    const mangas: CollectionManga[] = collectionWithMangas.MangaCollection.map(
      (manga) => manga.manga,
    );
    return mangas;
  }

  async addMangaToCollection(
    collectionId: string,
    manga: CollectionManga,
  ): Promise<Collection> {
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

    return updatedCollection;
  }

  async deleteMangaFromCollection(
    collectionId: string,
    mangaId: string,
  ): Promise<WasDeletedEntity> {
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

      return { deleted: true };
    } catch (error) {
      this.logger.error(error);
      return { deleted: false };
    }
  }
}
