import { HttpResponseStatus } from '../../enums';
import { DefaultHttpResponse } from '../common';

import { ApiProperty } from '@nestjs/swagger';

export class ProfilePicResponse {
  @ApiProperty({ example: 'https://example.com/profilepic.jpg' })
  profilePic: string;
}

export class FindProfilePicHttpResponse extends DefaultHttpResponse<ProfilePicResponse> {
  @ApiProperty({ example: HttpResponseStatus.SUCCESS })
  status: string;

  @ApiProperty({ type: ProfilePicResponse })
  data: ProfilePicResponse;

  constructor(status: string, data: ProfilePicResponse) {
    super(status, data);
  }
}
