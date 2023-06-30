import { DefaultHttpResponse } from '../common';

export class GetHealthHttpResponse extends DefaultHttpResponse<GetHealthResponse> {
  data: GetHealthResponse;
  status: string;

  constructor(status: string, data: GetHealthResponse) {
    super(status, data);
  }
}

class GetHealthResponse {
  version: string;
}
