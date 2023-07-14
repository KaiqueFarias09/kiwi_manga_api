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
import { MangaEntity, MangaSimplified } from '../core/entities';
import {
  CombinationsQueryDto,
  GetMorePagesFromCombinationQueryDto,
  QueryDto,
} from '../core/dtos';
import { HttpResponseStatus } from '../core/enums';
import {
  GetMangaByIdHttpResponse,
  GetMangasHttpResponse,
  GetMorePagesFromCombinationsHttpResponse,
  GetRandomMangaHttpResponse,
} from '../core/responses';
import { GetCombinationHttpResponse } from '../core/responses/mangas/get-combination.response';
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
  @ApiResponse({ status: 200, type: GetCombinationHttpResponse })
  @Get('/combinations')
  async getCombinations(
    @Query() { existingCombinationsIds }: CombinationsQueryDto,
  ): Promise<GetCombinationHttpResponse> {
    const data = await this.mangasService.getCombinations(
      existingCombinationsIds,
    );

    return {
      status: HttpResponseStatus.SUCCESS,
      data: {
        combinations: data,
      },
    };
  }

  @ApiOperation({ summary: 'Get more pages from a combination' })
  @ApiResponse({ status: 200, type: GetMorePagesFromCombinationsHttpResponse })
  @Get('/combinations/:combinationId')
  async getMorePagesFromCombination(
    @Param('combinationId') combinationId: string,
    @Query() { page }: GetMorePagesFromCombinationQueryDto,
  ): Promise<GetMorePagesFromCombinationsHttpResponse> {
    const data = await this.mangasService.getOneMorePageFromCombination({
      combinationId,
      page,
    });

    return {
      status: HttpResponseStatus.SUCCESS,
      data: {
        mangas: data,
      },
    };
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
