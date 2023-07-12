import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Manga,
  Prisma,
  PrismaClient,
} from '../../../prisma/prisma/mongo-client';
import { Chapter, MangaEntity, MangaSimplified } from '../../core/entities';

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
    cursor?: string,
  ): Promise<{ mangas: Manga[]; cursor: string | null }> {
    const mangas = await this.manga.findMany({
      where: {
        hasCover: true,
        OR: [...prismaSearchTerms, { genres: { hasSome: searchTerms } }],
        id: cursor ? { lt: cursor } : undefined,
      },
      orderBy: { id: 'desc' },
      take: 20,
    });

    // The new cursor will be the ID of the last manga in the list.
    const newCursor = mangas.length > 0 ? mangas[mangas.length - 1].id : null;

    return { mangas, cursor: newCursor };
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
