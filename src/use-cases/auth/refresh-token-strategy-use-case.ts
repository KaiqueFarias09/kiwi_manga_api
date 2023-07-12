import { Inject, Injectable } from '@nestjs/common';
import { IRefreshTokenStrategy } from '../../core/abstracts/auth/refresh-token-strategy.abstract';
import { JwtPayload, JwtPayloadWithRefreshToken } from '../../core/types';
import { Request } from 'express';

@Injectable()
export class RefreshTokenStrategyUseCase implements IRefreshTokenStrategy {
  refreshTokenStrategy: IRefreshTokenStrategy;

  constructor(@Inject(IRefreshTokenStrategy) strategy: IRefreshTokenStrategy) {
    this.refreshTokenStrategy = strategy;
  }

  validate(req: Request, payload: JwtPayload): JwtPayloadWithRefreshToken {
    return this.refreshTokenStrategy.validate(req, payload);
  }
}
