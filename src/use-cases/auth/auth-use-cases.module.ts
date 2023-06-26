import { Module } from '@nestjs/common';
import { AuthModule } from '../../services/auth/auth.module';
import { AuthServiceUseCases } from './auth-service-use-cases';
import { AuthStrategyUseCases } from './auth-strategy-use-cases';

@Module({
  imports: [AuthModule],
  providers: [AuthServiceUseCases, AuthStrategyUseCases],
  exports: [AuthServiceUseCases, AuthStrategyUseCases],
})
export class AuthUseCasesModule {}
