import { Module } from '@nestjs/common';
import { ProfilePicModule } from '../../services/profile-pic/profile-pic.module';
import { ProfilePicUseCase } from './profile-pic-use-case';

@Module({
  imports: [ProfilePicModule],
  providers: [ProfilePicUseCase],
  exports: [ProfilePicUseCase],
})
export class ProfilePicUseCaseModule {}
