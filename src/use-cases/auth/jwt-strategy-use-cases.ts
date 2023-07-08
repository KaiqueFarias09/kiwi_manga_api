import { Inject, Injectable } from '@nestjs/common';
import { IJwtStrategy } from '../../core/abstracts';

@Injectable()
export class JwtStrategyUseCases implements IJwtStrategy {
  jwtStrategy: IJwtStrategy;
  constructor(@Inject(IJwtStrategy) jwtStrategy: IJwtStrategy) {
    this.jwtStrategy = jwtStrategy;
  }
  validate(payload: { sub: number; email: string }) {
    return this.jwtStrategy.validate(payload);
  }
}
