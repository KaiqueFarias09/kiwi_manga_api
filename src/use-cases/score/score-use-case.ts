import { Injectable } from '@nestjs/common';
import { PodiumEntity } from '../../core/entities';
import { IScoreRepository } from '../../core/abstracts';

@Injectable()
export class ScoreUseCase {
  constructor(private readonly scoreRepository: IScoreRepository) {}
  increaseScore(userId: string, increase?: number): Promise<number> {
    return this.scoreRepository.increaseScore(userId, increase);
  }
  getPodiumAndUserScore(userId: string): Promise<PodiumEntity> {
    return this.scoreRepository.getPodiumAndUserScore(userId);
  }
}
