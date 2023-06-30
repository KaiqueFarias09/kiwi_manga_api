import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IScoreRepository } from '../../core/abstracts';
import { ResourceDoesNotExistException } from '../../core/errors/resource-does-not-exist.error';
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
    try {
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

      if (!score) throw new ResourceDoesNotExistException();
      return { score: score.score };
    } catch (error) {
      if (error.code === 'P2025') throw new ResourceDoesNotExistException();
    }
  }

  async getPodiumAndUserScore(userId: string): Promise<{
    podium: { name: string; score: number }[];
    userScore: number;
  }> {
    try {
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

      if (!user) throw new ResourceDoesNotExistException();

      return {
        userScore: user.score,
        podium: topUsers.map((user) => {
          return {
            name: user.nickname,
            score: user.score,
          };
        }),
      };
    } catch (error) {
      if (error.status === 404) throw new ResourceDoesNotExistException();

      throw new BadRequestException({
        message: error.message,
      });
    }
  }
}
