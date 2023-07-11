import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { QueryDto } from '../core/dtos';

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
  constructor(private mangasService: MangasUseCase) {}

  @ApiOperation({ summary: 'Find mangas by keyword' })
  @ApiResponse({
    status: 200,
    type: GetMangasHttpResponse,
  })
  @Get()
  async findMany(@Query() queryDto: QueryDto): Promise<GetMangasHttpResponse> {
    if (queryDto.keyword) {
      const data = await this.mangasService.getMangasBySearch(queryDto.keyword);
      return {
        status: HttpResponseStatus.SUCCESS,
        data: {
          mangas: data,
        },
      };
    }
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
    const data = await this.mangasService.getManga(mangaId);
    return {
      status: HttpResponseStatus.SUCCESS,
      data: {
        manga: data,
      },
    };
  }
  @ApiOperation({ summary: 'Get combinations of mangas' })
  @Get('/combinations')
  async getCombinations() {
    return this.mangasService.getCombinations();
  }
}
