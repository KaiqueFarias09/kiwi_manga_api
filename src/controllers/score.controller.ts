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
import { ApiTags } from '@nestjs/swagger';
import { IncreaseScoreDto } from 'src/core/dtos';
import { ScoreUseCase } from 'src/use-cases/score';

@ApiTags('score')
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
