import { Injectable } from '@nestjs/common';
import { IHealthRepository } from '../../core/abstracts/health/health-repository.abstract';

@Injectable()
export class GetHealthService implements IHealthRepository {
  getHealth() {
    return { version: '0.0.1' };
  }
}
