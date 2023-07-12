import { Inject, Injectable } from '@nestjs/common';
import { IApiKeyStrategy } from '../../core/abstracts';

@Injectable()
export class ApiKeyStrategyUseCase {
  auth: IApiKeyStrategy;
  constructor(@Inject(IApiKeyStrategy) authStrategy: IApiKeyStrategy) {
    this.auth = authStrategy;
  }

  validate(
    apiKey: string,
    done: (error: Error, data: any) => Record<string, never>,
  ) {
    return this.auth.validate(apiKey, done);
  }
}
