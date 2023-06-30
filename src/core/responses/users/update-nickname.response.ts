import { DefaultHttpResponse } from '../common';

export class UpdateNicknameHttpResponse extends DefaultHttpResponse<UpdateNicknameResponse> {
  data: UpdateNicknameResponse;
  status: string;

  constructor(status: string, data: UpdateNicknameResponse) {
    super(status, data);
  }
}

class UpdateNicknameResponse {
  user: {
    newNickname: string;
    id: string;
  };
}
