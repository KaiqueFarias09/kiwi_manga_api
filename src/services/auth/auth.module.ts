import { Module } from '@nestjs/common';
import { AuthServiceModule } from '../../frameworks/auth/auth-services.module';

@Module({
  imports: [AuthServiceModule],
  exports: [AuthServiceModule],
})
export class AuthModule {}
