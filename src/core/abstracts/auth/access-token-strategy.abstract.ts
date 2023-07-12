import { User } from 'prisma/prisma/postgres-client';

export abstract class IAccessTokenStrategy {
  abstract validate(payload: { sub: number; email: string }): Promise<User>;
}
