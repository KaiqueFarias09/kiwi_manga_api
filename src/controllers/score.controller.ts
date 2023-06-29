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
import { IncreaseScoreDto } from '../core/dtos';
import { ScoreUseCase } from '../use-cases/score';

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
  getPodiumAndUserScore(@Param('id') userID: string) {
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
