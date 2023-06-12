import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { IAuthStrategy } from 'src/core/abstracts';
import Strategy from 'passport-headerapikey';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthStrategyService
  extends PassportStrategy(Strategy, 'api-key')
  implements IAuthStrategy
{
  configService: ConfigService;
  constructor(@Inject(ConfigService) configService: ConfigService) {
    super(
      { header: 'Authorization', prefix: '' },
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
