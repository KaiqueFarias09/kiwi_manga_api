import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { HttpResponseStatus } from '../core/enums';
import { GetHealthHttpResponse } from '../core/responses';
import { HealthUseCases } from '../use-cases/health/health-use-case';

@ApiTags('health')
@ApiSecurity('X-API-Key')
@UseGuards(AuthGuard('api-key'))
@Controller('health')
export class HealthController {
  constructor(private readonly healthUseCase: HealthUseCases) {}

  @ApiResponse({ status: 200, type: GetHealthHttpResponse })
  @Get()
  getHealth(): GetHealthHttpResponse {
    const data = this.healthUseCase.getHealth();
    return {
      data: {
        version: data.version,
      },
      status: HttpResponseStatus.SUCCESS,
    };
  }
}
