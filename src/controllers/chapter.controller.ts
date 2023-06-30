import {
  Controller,
  Get,
  Inject,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { HttpResponseStatus } from '../core/enums';
import {
  GetChapterHttpResponse,
  GetChaptersHttpResponse,
} from '../core/responses';
import { ChapterUseCase } from '../use-cases';

@ApiTags('chapters')
@ApiSecurity('Authorization')
@Controller('chapters')
@UseGuards(AuthGuard('api-key'))
export class ChapterController {
  chapterService: ChapterUseCase;
  constructor(@Inject(ChapterUseCase) chapterService: ChapterUseCase) {
    this.chapterService = chapterService;
  }

  @ApiResponse({ status: 200, type: GetChaptersHttpResponse })
  @Get()
  async getChapters(
    @Query() { mangaId }: { mangaId: string },
  ): Promise<GetChaptersHttpResponse> {
    const data = await this.chapterService.getChapters(mangaId);
    return {
      status: HttpResponseStatus.SUCCESS,
      data: {
        chapters: data,
      },
    };
  }

  @ApiResponse({ status: 200, type: GetChapterHttpResponse })
  @Get(':chapterId')
  async getChapter(
    @Param('chapterId') chapterId: string,
  ): Promise<GetChapterHttpResponse> {
    const data = await this.chapterService.getChapter(chapterId);
    return {
      status: HttpResponseStatus.SUCCESS,
      data: {
        pages: data,
      },
    };
  }
}
