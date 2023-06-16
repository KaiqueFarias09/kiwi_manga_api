import { Controller, Get, UseGuards } from '@nestjs/common';
import { HealthUseCases } from '../use-cases/health/health-use-case';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('health')
@UseGuards(AuthGuard('api-key'))
@Controller('health')
export class HealthController {
  constructor(private readonly healthUseCase: HealthUseCases) {}

  @Get()
  getHealth() {
    return this.healthUseCase.getHealth();
  }
}
