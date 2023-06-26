import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { HealthUseCases } from '../use-cases/health/health-use-case';

@ApiTags('health')
@ApiSecurity('Authorization')
@UseGuards(AuthGuard('api-key'))
@Controller('health')
export class HealthController {
  constructor(private readonly healthUseCase: HealthUseCases) {}

  @Get()
  getHealth() {
    return this.healthUseCase.getHealth();
  }
}
