import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Chapter, MangaEntity, MangaSimplified } from '../../core/entities';
import {
  Manga,
  Prisma,
  PrismaClient,
} from '../../../prisma/prisma/mongo-client';

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
    return await this.manga.update({
      data: {
        chapters: { createMany: { data: chapters } },
      },
      where: {
        id: mangaId,
      },
    });
  }

  async createManga(manga: MangaEntity): Promise<Manga> {
    return await this.manga.create({
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
  ): Promise<Manga[]> {
    return await this.manga.findMany({
      where: {
        hasCover: true,
        OR: [...prismaSearchTerms, { genres: { hasSome: searchTerms } }],
      },
    });
  }

  async oneKeywordSearch(searchTerm: string): Promise<MangaSimplified[]> {
    return await this.manga.findMany({
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
