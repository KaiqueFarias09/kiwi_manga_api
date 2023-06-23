import { Module } from '@nestjs/common';
import { ProfilePicUseCase } from './profile-pic-use-case';
import { ProfilePicModule } from 'src/services/profile-pic/profile-pic.module';

@Module({
  imports: [ProfilePicModule],
  providers: [ProfilePicUseCase],
  exports: [ProfilePicUseCase],
})
export class ProfilePicUseCaseModule {}
