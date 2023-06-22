import { Module } from '@nestjs/common';

import { IAuthService, IAuthStrategy } from '../../core/abstracts';
import { AuthStrategyService } from './auth-strategy.service';
import { AuthService } from './auth-service.service';
import { JwtModule } from '@nestjs/jwt';
import { MongoService } from '../prisma/prisma.service';

@Module({
  imports: [JwtModule.register({})],
  providers: [
    { provide: IAuthStrategy, useClass: AuthStrategyService },
    { provide: IAuthService, useClass: AuthService },
    MongoService,
  ],
  exports: [IAuthStrategy, IAuthService],
})
export class AuthServiceModule {}
