import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import * as argon from 'argon2';
import { NextFunction, Request, Response } from 'express';
import { PostgresService } from 'src/frameworks/postgres-prisma/postgres-prisma.service';

@Injectable()
export class PasswordVerifierMiddleware implements NestMiddleware {
  postgresService: PostgresService;
  constructor(@Inject(PostgresService) postgresService: PostgresService) {
    this.postgresService = postgresService;
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const { id, password } = req.body;
    const user = await this.postgresService.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const match = await argon.verify(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    next();
  }
}
