import {
  Controller,
  Get,
  Inject,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { ChapterUseCase } from 'src/use-cases/chapters';

@ApiTags('chapters')
@Controller('chapters')
@UseGuards(AuthGuard('api-key'))
export class ChapterController {
  chapterService: ChapterUseCase;
  constructor(@Inject(ChapterUseCase) chapterService: ChapterUseCase) {
    this.chapterService = chapterService;
  }

  @Get()
  async getChapters(@Query() { mangaId }: { mangaId: string }) {
    return this.chapterService.getChapters(mangaId);
  }

  @Get(':chapterId')
  async getChapter(@Param('chapterId') chapterId: string) {
    return this.chapterService.getChapter(chapterId);
  }
}
