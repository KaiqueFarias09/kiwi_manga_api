import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';
import {
  IApiKeyStrategy,
  IAuthService,
  IJwtStrategy,
} from '../../core/abstracts';
import { PostgresService } from '../postgres-prisma/postgres-prisma.service';
import { AuthService } from './auth-service.service';
import { ApiKeyStrategyService } from './strategies/api-key.strategy';
import { JwtStrategyService } from './strategies/jwt.strategy';

@Module({
  imports: [JwtModule.register({})],
  providers: [
    { provide: IApiKeyStrategy, useClass: ApiKeyStrategyService },
    { provide: IJwtStrategy, useClass: JwtStrategyService },
    { provide: IAuthService, useClass: AuthService },
    PostgresService,
  ],
  exports: [IApiKeyStrategy, IAuthService],
})
export class AuthServiceModule {}
