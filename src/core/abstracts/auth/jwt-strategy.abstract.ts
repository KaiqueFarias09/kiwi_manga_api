import { User } from 'prisma/prisma/postgres-client';

export abstract class IJwtStrategy {
  abstract validate(payload: { sub: number; email: string }): Promise<User>;
}
