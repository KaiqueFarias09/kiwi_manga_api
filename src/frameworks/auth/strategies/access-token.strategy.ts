import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IAccessTokenStrategy } from '../../../core/abstracts';
import { PostgresService } from '../../postgres-prisma/postgres-prisma.service';

@Injectable()
export class AccessTokenStrategyService
  extends PassportStrategy(Strategy, 'jwt')
  implements IAccessTokenStrategy
{
  postgresService: PostgresService;
  constructor(
    config: ConfigService,
    @Inject(PostgresService) postgresService: PostgresService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('ACESS_TOKEN_SECRET'),
    });
    this.postgresService = postgresService;
  }

  async validate(payload: { sub: number; email: string }) {
    const user = await this.postgresService.user.findUnique({
      where: {
        id: payload.sub.toString(),
      },
    });
    delete user.password;
    return user;
  }
}
