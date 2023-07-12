import { Inject, Injectable } from '@nestjs/common';
import { IAccessTokenStrategy } from '../../core/abstracts';

@Injectable()
export class AccessTokenStrategyUseCase implements IAccessTokenStrategy {
  jwtStrategy: IAccessTokenStrategy;
  constructor(@Inject(IAccessTokenStrategy) jwtStrategy: IAccessTokenStrategy) {
    this.jwtStrategy = jwtStrategy;
  }
  validate(payload: { sub: number; email: string }) {
    return this.jwtStrategy.validate(payload);
  }
}
