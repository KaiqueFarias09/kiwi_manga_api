import { Inject, Injectable } from '@nestjs/common';
import { IAuthStrategy } from '../../core/abstracts';

@Injectable()
export class AuthStrategyUseCases {
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
