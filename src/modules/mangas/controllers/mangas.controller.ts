import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { MangasService } from '../services/mangas.service';
import { QueryDto } from '../dto';
@Controller()
export class MangasController {
  constructor(private mangasService: MangasService) {}

  @Get('manga_list')
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  async getMangaList(@Query() query: QueryDto) {
    return this.mangasService.scrapeMangaList({
      genre: query.genre,
      language: query.language,
      keyw: query.keyw,
      orby: query.orby,
      page: query.page,
    });
  }
}
