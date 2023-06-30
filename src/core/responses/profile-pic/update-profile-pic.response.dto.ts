import { DefaultHttpResponse } from '../common';

export class UpdateProfilePicHttpResponse extends DefaultHttpResponse<UpdateProfilePicResponse> {
  status: string;
  data: UpdateProfilePicResponse;

  constructor(status: string, data: UpdateProfilePicResponse) {
    super(status, data);
  }
}

class UpdateProfilePicResponse {
  profilePic: string;
}
