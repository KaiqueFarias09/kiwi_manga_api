import { Injectable } from '@nestjs/common';
import { IScoreRepository } from 'src/core/abstracts';

@Injectable()
export class ScoreUseCase {
  constructor(private readonly scoreRepository: IScoreRepository) {}
  increaseScore(userId: string, increase?: number): Promise<{ score: number }> {
    return this.scoreRepository.increaseScore(userId, increase);
  }
  getPodiumAndUserScore(
    userId: string,
  ): Promise<{ podium: { name: string; score: number }[]; userScore: number }> {
    return this.scoreRepository.getPodiumAndUserScore(userId);
  }
}
