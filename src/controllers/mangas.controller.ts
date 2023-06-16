import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { MangasUseCase } from 'src/use-cases/mangas/mangas-use-case';
@Controller('mangas')
@UseGuards(AuthGuard('api-key'))
export class MangasController {
  constructor(private mangasService: MangasUseCase) {}

  @Get()
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  async getMangaList(@Query() { keyw }: { keyw: string }) {
    if (keyw) {
      return this.mangasService.searchForMangas(keyw);
    } else {
      return this.mangasService.getMangas(keyw);
    }
  }

  @Get(':id')
  async getManga(@Headers('url') url: string) {
    return this.mangasService.getManga(url);
  }

  @Get('random')
  async getRandomManga() {
    return this.mangasService.getRandomManga();
  }
}
