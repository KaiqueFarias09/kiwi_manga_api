import { Injectable } from '@nestjs/common';
import { IHealthRepository } from '../../core/abstracts/health/health-repository.abstract';

@Injectable()
export class HealthUseCases {
  constructor(private readonly healthRepository: IHealthRepository) {}

  getHealth() {
    return this.healthRepository.getHealth();
  }
}
