import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import * as argon from 'argon2';
import { NextFunction, Request, Response } from 'express';
import { PostgresService } from '../frameworks/postgres-prisma/postgres-prisma.service';

@Injectable()
export class PasswordVerifierMiddleware implements NestMiddleware {
  postgresService: PostgresService;
  constructor(@Inject(PostgresService) postgresService: PostgresService) {
    this.postgresService = postgresService;
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const { password } = req.body;
    const userId = req.url.split('/')[1];

    const user = await this.postgresService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const match = await argon.verify(user.password, password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    next();
  }
}
