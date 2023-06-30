import { PodiumEntity } from '../../../core/entities';

export abstract class IScoreRepository {
  abstract increaseScore(userId: string, increase?: number): Promise<number>;
  abstract getPodiumAndUserScore(userId: string): Promise<PodiumEntity>;
}
