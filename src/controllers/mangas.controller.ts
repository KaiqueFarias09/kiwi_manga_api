import { Controller, Get, Query, UseGuards, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { QueryDto } from 'src/core/dtos/manga-list';

import { MangasUseCase } from 'src/use-cases/mangas/mangas-use-case';
@Controller('mangas')
@UseGuards(AuthGuard('api-key'))
export class MangasController {
  constructor(private mangasService: MangasUseCase) {}

  @Get()
  async findMany(@Query() queryDto: QueryDto) {
    if (queryDto.keywords) {
      return this.mangasService.getMangas(queryDto.keywords);
    }
  }

  @Get('/random')
  async findRandom() {
    return this.mangasService.getRandomManga();
  }

  @Get('/:id')
  async findUnique(@Param('id') id: string) {
    return this.mangasService.getManga(id);
  }
}
