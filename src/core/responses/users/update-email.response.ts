import { DefaultHttpResponse } from '../common';

export class UpdateEmailHttpResponse extends DefaultHttpResponse<UpdateEmailResponse> {
  data: UpdateEmailResponse;
  status: string;

  constructor(status: string, data: UpdateEmailResponse) {
    super(status, data);
  }
}

class UpdateEmailResponse {
  user: { newEmail: string; id: string };
}
