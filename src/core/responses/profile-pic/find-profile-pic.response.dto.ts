import { DefaultHttpResponse } from '../common';

export class FindProfilePicHttpResponse extends DefaultHttpResponse<ProfilePicResponse> {
  status: string;
  data: ProfilePicResponse;

  constructor(status: string, data: ProfilePicResponse) {
    super(status, data);
  }
}

export class ProfilePicResponse {
  profilePic: string;
}
