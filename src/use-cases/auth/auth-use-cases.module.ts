import { Module } from '@nestjs/common';
import { AuthModule } from '../../services/auth/auth.module';
import { AuthServiceUseCases } from './auth-service-use-cases';
import { ApiKeyStrategyUseCase } from './api-key-strategy-use-cases';
import { RefreshTokenStrategyUseCase } from './refresh-token-strategy-use-case';
import { AccessTokenStrategyUseCase } from './access-token-strategy-use-case';

@Module({
  imports: [AuthModule],
  providers: [
    AuthServiceUseCases,
    ApiKeyStrategyUseCase,
    RefreshTokenStrategyUseCase,
    AccessTokenStrategyUseCase,
  ],
  exports: [
    AuthServiceUseCases,
    ApiKeyStrategyUseCase,
    RefreshTokenStrategyUseCase,
    AccessTokenStrategyUseCase,
  ],
})
export class AuthUseCasesModule {}
