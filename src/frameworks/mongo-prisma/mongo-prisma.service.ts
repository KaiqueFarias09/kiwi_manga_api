import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Manga,
  Prisma,
  PrismaClient,
} from '../../../prisma/prisma/mongo-client';
import { Chapter, MangaEntity, MangaSimplified } from '../../core/entities';
import { ResourceNotFoundException } from '../../core/errors';

@Injectable()
export class MongoService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('MONGODB_URL'),
        },
      },
    });
  }

  async addChaptersToManga({
    mangaId,
    chapters,
  }: {
    mangaId: string;
    chapters: Chapter[];
  }): Promise<Manga> {
    return this.manga.update({
      data: {
        chapters: { createMany: { data: chapters } },
      },
      where: {
        id: mangaId,
      },
    });
  }

  async createManga(manga: MangaEntity): Promise<Manga> {
    return this.manga.create({
      data: {
        source: 'novelcool',
        cover: manga.cover,
        name: manga.name,
        url: manga.url,
        synopsis: manga.synopsis,
        hasCover: manga.hasCover,
        status: manga.status,
        updatedAt: manga.updatedAt,
        genres: manga.genres,
        chapters: {
          createMany: {
            data: manga.chapters,
          },
        },
      },
    });
  }

  async multiFieldMangaSearch(
    prismaSearchTerms: Prisma.MangaWhereInput[],
    searchTerms: string[],
    page: number,
  ): Promise<Manga[]> {
    const mangas = await this.manga.findMany({
      where: {
        hasCover: true,
        OR: [...prismaSearchTerms, { genres: { hasSome: searchTerms } }],
      },
      take: 20,
      skip: 20 * page,
    });

    if (mangas.length === 0) throw new ResourceNotFoundException();
    return mangas;
  }

  async oneKeywordSearch(searchTerm: string): Promise<MangaSimplified[]> {
    return this.manga.findMany({
      where: {
        name: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        name: true,
        cover: true,
        url: true,
        synopsis: true,
        hasCover: true,
      },
    });
  }
}
