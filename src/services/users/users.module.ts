import { Module } from '@nestjs/common';
import { UsersServiceModule } from '../../frameworks/users/users-service.module';

@Module({
  imports: [UsersServiceModule],
  exports: [UsersServiceModule],
})
export class UsersModule {}
