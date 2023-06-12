import { Module } from '@nestjs/common';
import { IHealthRepository } from '../../core/abstracts';
import { GetHealthService } from './get-health-service.service';

@Module({
  providers: [
    {
      provide: IHealthRepository,
      useClass: GetHealthService,
    },
  ],
  exports: [IHealthRepository],
})
export class GetHealthModule {}
