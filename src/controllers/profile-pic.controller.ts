import { Controller, Get } from '@nestjs/common';

@Controller('profile-pic')
export class ProfilePicController {
  @Get()
  findProfilePic() {
    return '';
  }
}
