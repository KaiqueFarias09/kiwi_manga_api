import { DefaultHttpResponse } from '../common';

export class SignupHttpResponse extends DefaultHttpResponse<SignupResponse> {
  status: string;
  data: SignupResponse;

  constructor(status: string, data: SignupResponse) {
    super(status, data);
  }
}

export class SignupResponse {
  access_token: string;
}
