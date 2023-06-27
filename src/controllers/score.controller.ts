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
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ScoreUseCase } from '../use-cases/score';
import { IncreaseScoreDto } from '../core/dtos';

@ApiTags('score')
@ApiSecurity('Authorization')
@UseGuards(AuthGuard('api-key'))
@Controller('score')
export class ScoreController {
  scoreService: ScoreUseCase;
  constructor(@Inject(ScoreUseCase) scoreUseCaseService: ScoreUseCase) {
    this.scoreService = scoreUseCaseService;
  }

  @Get(':id')
  getPodiumAndUserScore(
    @Param('id') userID: string,
  ): Promise<{ podium: { name: string; score: number }[]; userScore: number }> {
    return this.scoreService.getPodiumAndUserScore(userID);
  }

  @Put(':id')
  increaseScore(
    @Param('id') userID: string,
    @Body() { increase }: IncreaseScoreDto,
  ): Promise<{ score: number }> {
    return this.scoreService.increaseScore(userID, increase);
  }
}
