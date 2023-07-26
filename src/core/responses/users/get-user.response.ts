import { DefaultHttpResponse } from '../common';

export abstract class GetUserHttpResponse
  implements DefaultHttpResponse<GetUserResponse>
{
  status: string;
  data: GetUserResponse;

  constructor(status: string, data: GetUserResponse) {
    this.status = status;
    this.data = data;
  }
}

class GetUserResponse {
  id: string;
  nickname: string;
  email: string;
  profilePicture: string;
  score: number;
  createdAt: string;
  hashedRefreshToken: string;
}
