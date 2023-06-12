import { Controller, Get, Headers } from '@nestjs/common';
import { ChapterUseCase } from 'src/use-cases/chapters';

@Controller()
export class ChapterController {
  constructor(private chapterService: ChapterUseCase) {}

  @Get('read_manga')
  async getChapter(@Headers('url') url: string) {
    return this.chapterService.getChapter(url);
  }
}
