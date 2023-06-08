import { Controller, Get, Headers } from '@nestjs/common';
import { ChapterService } from '../services/chapter.service';

@Controller()
export class ChapterController {
  constructor(private chapterService: ChapterService) {}

  @Get('read_manga')
  async getChapter(@Headers('url') url: string) {
    return this.chapterService.scrapeChapter(url);
  }
}
