import { Inject, Injectable } from '@nestjs/common';
import { IScoreRepository } from 'src/core/abstracts';
import { PostgresService } from '../postgres-prisma/postgres-prisma.service';

@Injectable()
export class ScoreServiceService implements IScoreRepository {
  postgresService: PostgresService;
  constructor(@Inject(PostgresService) postgresService: PostgresService) {
    this.postgresService = postgresService;
  }

  async increaseScore(
    userId: string,
    increase?: number,
  ): Promise<{ score: number }> {
    const score = await this.postgresService.user.update({
      where: {
        id: userId,
      },
      data: {
        score: {
          increment: increase || 1,
        },
      },
    });
    return { score: score.score };
  }

  async getPodiumAndUserScore(userId: string): Promise<{
    podium: { name: string; score: number }[];
    userScore: number;
  }> {
    const [topUsers, user] = await Promise.all([
      this.postgresService.user.groupBy({
        by: ['score', 'nickname'],
        _count: {
          score: true,
        },
        orderBy: {
          score: 'desc',
        },
        take: 3,
      }),
      this.postgresService.user.findUnique({ where: { id: userId } }),
    ]);

    return {
      userScore: user.score,
      podium: topUsers.map((user) => {
        return {
          name: user.nickname,
          score: user.score,
        };
      }),
    };
  }
}
