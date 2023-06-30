import { DefaultHttpResponse } from '../common';

export class UpdatePasswordHttpResponse extends DefaultHttpResponse<UpdatePasswordResponse> {
  data: UpdatePasswordResponse;
  status: string;

  constructor(status: string, data: UpdatePasswordResponse) {
    super(status, data);
  }
}

class UpdatePasswordResponse {
  user: {
    id: string;
    nickname: string;
  };
}
