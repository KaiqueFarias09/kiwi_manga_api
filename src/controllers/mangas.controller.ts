import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { QueryDto } from '../core/dtos';

import { MangasUseCase } from '../use-cases/mangas/mangas-use-case';

@ApiTags('mangas')
@ApiSecurity('Authorization')
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
