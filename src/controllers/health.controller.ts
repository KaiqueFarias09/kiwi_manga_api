import { Controller, Get } from '@nestjs/common';
import { HealthUseCases } from '../use-cases/health/health-use-case';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthUseCase: HealthUseCases) {}

  @Get()
  getHealth() {
    return this.healthUseCase.getHealth();
  }
}
