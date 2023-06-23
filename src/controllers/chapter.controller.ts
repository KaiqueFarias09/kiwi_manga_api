import { Controller, Get, Headers, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { ChapterUseCase } from 'src/use-cases/chapters';

@ApiTags('chapters')
@Controller()
@UseGuards(AuthGuard('api-key'))
export class ChapterController {
  constructor(private chapterService: ChapterUseCase) {}

  @Get('read_manga')
  async getChapter(@Headers('url') url: string) {
    return this.chapterService.getChapter(url);
  }
}
