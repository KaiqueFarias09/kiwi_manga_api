import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
  Headers,
} from '@nestjs/common';

import { MangasUseCase } from 'src/use-cases/mangas/mangas-use-case';
@Controller()
export class MangasController {
  constructor(private mangasService: MangasUseCase) {}

  @Get('manga_list')
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  async getMangaList(@Query() { keyw }: { keyw: string }) {
    return this.mangasService.getMangas(keyw);
  }

  @Get('manga_info')
  async getManga(@Headers('url') url: string) {
    return this.mangasService.getManga(url);
  }
}
