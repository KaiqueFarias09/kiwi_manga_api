import { Module } from '@nestjs/common';

import { IAuthService, IAuthStrategy } from '../../core/abstracts';
import { AuthStrategyService } from './auth-strategy.service';
import { AuthService } from './auth-service.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [JwtModule.register({}), ConfigModule],
  providers: [
    { provide: IAuthStrategy, useClass: AuthStrategyService },
    { provide: IAuthService, useClass: AuthService },
    PrismaService,
  ],
  exports: [IAuthStrategy, IAuthService],
})
export class AuthServiceModule {}
