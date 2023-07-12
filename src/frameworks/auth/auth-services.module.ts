import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';
import {
  IAccessTokenStrategy,
  IApiKeyStrategy,
  IAuthService,
} from '../../core/abstracts';
import { PostgresService } from '../postgres-prisma/postgres-prisma.service';
import { AuthService } from './auth-service.service';
import { ApiKeyStrategyService } from './strategies/api-key.strategy';
import { AccessTokenStrategyService } from './strategies/access-token.strategy';
import { IRefreshTokenStrategy } from '../../core/abstracts/auth/refresh-token-strategy.abstract';
import { RefreshTokenStrategyService } from './strategies/refresh-token.strategy';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [JwtModule.register({}), ConfigModule],
  providers: [
    { provide: IApiKeyStrategy, useClass: ApiKeyStrategyService },
    { provide: IAccessTokenStrategy, useClass: AccessTokenStrategyService },
    { provide: IAuthService, useClass: AuthService },
    { provide: IRefreshTokenStrategy, useClass: RefreshTokenStrategyService },
    PostgresService,
  ],
  exports: [
    IApiKeyStrategy,
    IAuthService,
    IAccessTokenStrategy,
    IRefreshTokenStrategy,
  ],
})
export class AuthServiceModule {}
