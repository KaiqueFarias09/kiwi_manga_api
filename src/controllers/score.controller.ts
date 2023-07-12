import { Body, Controller, Get, Inject, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { IncreaseScoreDto } from '../core/dtos';
import { HttpResponseStatus } from '../core/enums';
import {
  GetPodiumHttpResponse,
  IncreaseScoreHttpResponse,
} from '../core/responses';
import { ScoreUseCase } from '../use-cases/score';
import { GetUser } from '../decorators';
import { User } from '../../prisma/prisma/postgres-client';

@ApiTags('score')
@ApiSecurity('X-API-Key')
@ApiSecurity('Authorization')
@UseGuards(AuthGuard('api-key'), AuthGuard('jwt'))
@Controller('score')
export class ScoreController {
  scoreService: ScoreUseCase;
  constructor(@Inject(ScoreUseCase) scoreUseCaseService: ScoreUseCase) {
    this.scoreService = scoreUseCaseService;
  }

  @ApiOperation({ summary: 'Get podium and user score' })
  @ApiResponse({ status: 200, type: GetPodiumHttpResponse })
  @Get('podium')
  async getPodiumAndUserScore(
    @GetUser() user: User,
  ): Promise<GetPodiumHttpResponse> {
    const data = await this.scoreService.getPodiumAndUserScore(user.id);
    return {
      status: HttpResponseStatus.SUCCESS,
      data,
    };
  }

  @ApiOperation({ summary: 'Increase user score' })
  @ApiResponse({ status: 200, type: IncreaseScoreHttpResponse })
  @Put()
  async increaseScore(
    @GetUser() user: User,
    @Body() { pointsToAdd }: IncreaseScoreDto,
  ): Promise<IncreaseScoreHttpResponse> {
    const data = await this.scoreService.increaseScore(user.id, pointsToAdd);
    return {
      status: HttpResponseStatus.SUCCESS,
      data: {
        score: data,
      },
    };
  }
}
