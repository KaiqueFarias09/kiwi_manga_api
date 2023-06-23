export abstract class IScoreRepository {
  abstract increaseScore(
    userId: string,
    increase?: number,
  ): Promise<{ score: number }>;
  abstract getPodiumAndUserScore(userId: string): Promise<{
    podium: { name: string; score: number }[];
    userScore: number;
  }>;
}
