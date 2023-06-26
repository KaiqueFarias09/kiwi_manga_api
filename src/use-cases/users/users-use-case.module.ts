import { Module } from '@nestjs/common';
import { UsersModule } from '../../services/users/users.module';
import { UsersUseCase } from './users-use-case';

@Module({
  imports: [UsersModule],
  providers: [UsersUseCase],
  exports: [UsersUseCase],
})
export class UsersUseCaseModule {}
