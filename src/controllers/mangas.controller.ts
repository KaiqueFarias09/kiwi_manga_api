import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { QueryDto } from '../core/dtos';

import { HttpResponseStatus } from '../core/enums';
import {
  GetMangaByIdHttpResponse,
  GetMangasHttpResponse,
  GetRandomMangaHttpResponse,
} from '../core/responses';
import { MangasUseCase } from '../use-cases/mangas/mangas-use-case';

@ApiTags('mangas')
@ApiSecurity('Authorization')
@Controller('mangas')
@UseGuards(AuthGuard('api-key'))
export class MangasController {
  constructor(private mangasService: MangasUseCase) {}

  @ApiResponse({
    status: 200,
    type: GetMangasHttpResponse,
  })
  @Get()
  async findMany(@Query() queryDto: QueryDto): Promise<GetMangasHttpResponse> {
    if (queryDto.keywords) {
      const data = await this.mangasService.getMangas(queryDto.keywords);
      return {
        status: HttpResponseStatus.SUCCESS,
        data: {
          mangas: data,
        },
      };
    }
  }

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

  @ApiResponse({
    status: 200,
    type: GetMangaByIdHttpResponse,
  })
  @Get('/:id')
  async findUnique(@Param('id') id: string): Promise<GetMangaByIdHttpResponse> {
    const data = await this.mangasService.getManga(id);
    return {
      status: HttpResponseStatus.SUCCESS,
      data: {
        manga: data,
      },
    };
  }
}
