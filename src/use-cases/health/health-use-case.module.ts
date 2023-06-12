import { Module } from '@nestjs/common';
import { HealthModule } from '../../services/health/health.module';
import { HealthUseCases } from './health-use-case';

@Module({
  imports: [HealthModule],
  providers: [HealthUseCases],
  exports: [HealthUseCases],
})
export class HealthUseCaseModule {}
