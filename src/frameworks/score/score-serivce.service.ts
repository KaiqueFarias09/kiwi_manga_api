import { Injectable } from '@nestjs/common';
import { IScoreRepository } from 'src/core/abstracts';

@Injectable()
export class ScoreServiceService implements IScoreRepository {
  increaseScore(userId: string, increase?: number): Promise<{ score: number }> {
    throw new Error('Method not implemented.');
  }
  getPodiumAndUserScore(
    userId: string,
  ): Promise<{ podium: { name: string; score: number }[]; userScore: number }> {
    throw new Error('Method not implemented.');
  }
}
