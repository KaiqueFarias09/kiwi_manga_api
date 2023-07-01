import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { HttpResponseStatus } from '../core/enums';
import { IncreaseScoreDto } from '../core/dtos';
import {
  GetPodiumHttpResponse,
  IncreaseScoreHttpResponse,
} from '../core/responses';
import { ScoreUseCase } from '../use-cases/score';

@ApiTags('score')
@ApiSecurity('Authorization')
@UseGuards(AuthGuard('api-key'))
@Controller(':userId/score')
export class ScoreController {
  scoreService: ScoreUseCase;
  constructor(@Inject(ScoreUseCase) scoreUseCaseService: ScoreUseCase) {
    this.scoreService = scoreUseCaseService;
  }

  @ApiResponse({ status: 200, type: GetPodiumHttpResponse })
  @Get()
  async getPodiumAndUserScore(
    @Param('userId') userID: string,
  ): Promise<GetPodiumHttpResponse> {
    const data = await this.scoreService.getPodiumAndUserScore(userID);
    return {
      status: HttpResponseStatus.SUCCESS,
      data,
    };
  }

  @ApiResponse({ status: 200, type: IncreaseScoreHttpResponse })
  @Put()
  async increaseScore(
    @Param('userId') userID: string,
    @Body() { increase }: IncreaseScoreDto,
  ): Promise<IncreaseScoreHttpResponse> {
    const data = await this.scoreService.increaseScore(userID, increase);
    return {
      status: HttpResponseStatus.SUCCESS,
      data: {
        score: data,
      },
    };
  }
}
