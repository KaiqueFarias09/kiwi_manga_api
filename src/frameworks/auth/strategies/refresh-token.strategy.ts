import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload, JwtPayloadWithRefreshToken } from '../../../core/types';
import { ForbiddenException } from '@nestjs/common';
import { IRefreshTokenStrategy } from '../../../core/abstracts/auth/refresh-token-strategy.abstract';
import { Request } from 'express';

export class RefreshTokenStrategyService
  extends PassportStrategy(Strategy, 'jwt-refresh')
  implements IRefreshTokenStrategy
{
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.REFRESH_TOKEN_SECRET,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtPayload): JwtPayloadWithRefreshToken {
    const refreshToken = req
      ?.get('authorization')
      ?.replace('Bearer', '')
      .trim();

    if (!refreshToken) throw new ForbiddenException('Refresh token malformed');

    return { payload, refreshToken };
  }
}
