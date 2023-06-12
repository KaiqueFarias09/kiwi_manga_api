import { Inject, Injectable } from '@nestjs/common';
import { IAuthStrategy } from 'src/core/abstracts';

@Injectable()
export class AuthStrategyUseCases implements IAuthStrategy {
  auth: IAuthStrategy;
  constructor(@Inject(IAuthStrategy) authStrategy: IAuthStrategy) {
    this.auth = authStrategy;
  }

  validate(
    apiKey: string,
    done: (error: Error, data: any) => Record<string, never>,
  ) {
    return this.auth.validate(apiKey, done);
  }
}
