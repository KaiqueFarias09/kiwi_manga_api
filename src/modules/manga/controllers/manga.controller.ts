import { Controller, Get, Headers } from '@nestjs/common';
import { MangaService } from '../services/manga.service';

@Controller()
export class MangaController {
  constructor(private mangaService: MangaService) {}

  @Get('manga_info')
  async getManga(@Headers('url') url: string) {
    return this.mangaService.scrapeMangaInfo(url);
  }
}
