import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Controller,
  Get,
  Inject,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { Cache } from 'cache-manager';
import { MangaEntity, MangaSimplified } from 'src/core/entities';
import {
  CombinationsQueryDto,
  GetMorePagesFromCombinationQueryDto,
  QueryDto,
} from '../core/dtos';
import { HttpResponseStatus } from '../core/enums';
import {
  GetMangaByIdHttpResponse,
  GetMangasHttpResponse,
  GetRandomMangaHttpResponse,
} from '../core/responses';
import { MangasUseCase } from '../use-cases';

@ApiTags('mangas')
@ApiSecurity('X-API-Key')
@Controller('mangas')
@UseGuards(AuthGuard('api-key'))
export class MangasController {
  constructor(
    @Inject(MangasUseCase) private mangasService: MangasUseCase,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @ApiOperation({ summary: 'Get combinations of mangas' })
  @Get('/combinations')
  async getCombinations(
    @Query() { existingCombinationsIds }: CombinationsQueryDto,
  ) {
    return this.mangasService.getCombinations(existingCombinationsIds);
  }

  @Get('/combinations/:combinationId')
  async getMorePagesFromCombination(
    @Param('combinationId') combinationId: string,
    @Query() { cursor }: GetMorePagesFromCombinationQueryDto,
  ) {
    return this.mangasService.getOneMorePageFromCombination({
      combinationId,
      cursor,
    });
  }

  @ApiOperation({ summary: 'Find mangas by keyword' })
  @ApiResponse({
    status: 200,
    type: GetMangasHttpResponse,
  })
  @Get()
  async findMany(@Query() queryDto: QueryDto): Promise<GetMangasHttpResponse> {
    const cachedData = await this.cacheManager.get(
      `mangas-search-${queryDto.keyword}`,
    );
    if (cachedData)
      return {
        status: HttpResponseStatus.SUCCESS,
        data: {
          mangas: cachedData as MangaSimplified[],
        },
      };

    const data = await this.mangasService.getMangasBySearch(queryDto.keyword);
    await this.cacheManager.set(
      `mangas-search-${queryDto.keyword}`,
      data,
      60 * 60 * 7,
    );
    return {
      status: HttpResponseStatus.SUCCESS,
      data: {
        mangas: data,
      },
    };
  }

  @ApiOperation({ summary: 'Find a random manga' })
  @ApiResponse({
    status: 200,
    type: GetRandomMangaHttpResponse,
  })
  @Get('/random')
  async findRandom(): Promise<GetRandomMangaHttpResponse> {
    const data = await this.mangasService.getRandomManga();
    return {
      status: HttpResponseStatus.SUCCESS,
      data: {
        manga: data,
      },
    };
  }
  @ApiOperation({ summary: 'Find a manga by its ID' })
  @ApiResponse({
    status: 200,
    type: GetMangaByIdHttpResponse,
  })
  @Get('/:mangaId')
  async findUnique(
    @Param('mangaId') mangaId: string,
  ): Promise<GetMangaByIdHttpResponse> {
    const cachedData = await this.cacheManager.get(`manga-${mangaId}`);
    if (cachedData)
      return {
        status: HttpResponseStatus.SUCCESS,
        data: {
          manga: cachedData as MangaEntity,
        },
      };

    const data = await this.mangasService.getManga(mangaId);
    await this.cacheManager.set(`manga-${mangaId}`, data, 60 * 60);
    return {
      status: HttpResponseStatus.SUCCESS,
      data: {
        manga: data,
      },
    };
  }
}
