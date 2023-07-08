import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IJwtStrategy } from '../../../core/abstracts';
import { PostgresService } from '../../../frameworks/postgres-prisma/postgres-prisma.service';

@Injectable()
export class JwtStrategyService
  extends PassportStrategy(Strategy, 'jwt')
  implements IJwtStrategy
{
  postgresService: PostgresService;
  constructor(
    config: ConfigService,
    @Inject(PostgresService) postgresService: PostgresService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
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
