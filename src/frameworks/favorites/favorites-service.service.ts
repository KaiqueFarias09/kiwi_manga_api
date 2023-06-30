import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { IFavoritesRepository } from '../../core/abstracts';
import { CollectionManga, WasDeletedEntity } from '../../core/entities';
import { ResourceDoesNotExistException } from '../../core/errors/resource-does-not-exist.error';
import { PostgresService } from '../postgres-prisma/postgres-prisma.service';

@Injectable()
export class FavoritesServiceService implements IFavoritesRepository {
  postgresService: PostgresService;
  logger = new Logger('FavoritesServiceService');
  constructor(@Inject(PostgresService) postgresService: PostgresService) {
    this.postgresService = postgresService;
  }

  async getFavorites(userId: string): Promise<CollectionManga[]> {
    try {
      const data = await this.postgresService.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          FavoriteManga: {
            include: {
              manga: true,
            },
          },
        },
      });

      return data.FavoriteManga.map((manga) => {
        return manga.manga;
      });
    } catch (error) {
      if (
        error.message ===
        "Cannot read properties of null (reading 'FavoriteManga')"
      ) {
        throw new ResourceDoesNotExistException();
      }
    }
  }

  async addFavorite(
    manga: CollectionManga,
    userId: string,
  ): Promise<CollectionManga> {
    try {
      await this.postgresService.favoriteManga.create({
        data: {
          user: {
            connect: {
              id: userId,
            },
          },
          manga: {
            connectOrCreate: {
              where: {
                id: manga.id,
              },
              create: {
                name: manga.name,
                cover: manga.cover,
                synopsis: manga.synopsis,
                id: manga.id,
              },
            },
          },
        },
      });

      return manga;
    } catch (error) {
      if (error.code === 'P2025') throw new ResourceDoesNotExistException();

      if (error.code === 'P2002')
        throw new BadRequestException({
          message: 'Manga already exists in favorites',
          statusCode: 400,
        });
    }
  }

  async removeFavorite(
    manga: CollectionManga,
    userId: string,
  ): Promise<WasDeletedEntity> {
    try {
      await this.postgresService.favoriteManga.delete({
        where: {
          mangaId_userId: {
            mangaId: manga.id,
            userId: userId,
          },
        },
      });
      return {
        deleted: true,
      };
    } catch (error) {
      if (error.code === 'P2025')
        throw new BadRequestException({
          message: "Record to delete doesn't exist",
          statusCode: 400,
        });
    }
  }
}
