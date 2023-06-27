import { Module } from '@nestjs/common';
import { ProfilePicServiceModule } from '../../frameworks/profile-pic/profile-pic-service.module';

@Module({
  imports: [ProfilePicServiceModule],
  exports: [ProfilePicServiceModule],
})
export class ProfilePicModule {}
