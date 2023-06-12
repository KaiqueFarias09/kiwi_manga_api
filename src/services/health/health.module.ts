import { Module } from '@nestjs/common';
import { GetHealthModule } from '../../frameworks/health/get-health-service.module';

@Module({
  imports: [GetHealthModule],
  exports: [GetHealthModule],
})
export class HealthModule {}
