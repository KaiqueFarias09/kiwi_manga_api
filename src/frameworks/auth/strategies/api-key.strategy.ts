import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-headerapikey';
import { IApiKeyStrategy } from '../../../core/abstracts';

@Injectable()
export class ApiKeyStrategyService
  extends PassportStrategy(Strategy, 'api-key')
  implements IApiKeyStrategy
{
  configService: ConfigService;
  constructor(@Inject(ConfigService) configService: ConfigService) {
    super(
      { header: 'X-API-Key', prefix: '' },
      true,
      async (
        apiKey: string,
        done: (error: Error, data: any) => Record<string, never>,
      ) => {
        return this.validate(apiKey, done);
      },
    );
    this.configService = configService;
  }

  public validate(
    apiKey: string,
    done: (error: Error, data: any) => Record<string, never>,
  ) {
    if (this.configService.get<string>('ADMIN_TOKEN') === apiKey) {
      done(null, true);
    }
    done(new UnauthorizedException(), null);
  }
}
