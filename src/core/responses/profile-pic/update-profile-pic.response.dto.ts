import { HttpResponseStatus } from '../../enums';
import { DefaultHttpResponse } from '../common';

import { ApiProperty } from '@nestjs/swagger';

class UpdateProfilePicResponse {
  @ApiProperty({ example: 'https://example.com/new-profile-pic.jpg' })
  profilePic: string;
}

export class UpdateProfilePicHttpResponse extends DefaultHttpResponse<UpdateProfilePicResponse> {
  @ApiProperty({ example: HttpResponseStatus.SUCCESS })
  status: string;

  @ApiProperty({ type: UpdateProfilePicResponse })
  data: UpdateProfilePicResponse;

  constructor(status: string, data: UpdateProfilePicResponse) {
    super(status, data);
  }
}
