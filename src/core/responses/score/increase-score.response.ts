import { DefaultHttpResponse } from '../common';

export class IncreaseScoreHttpResponse extends DefaultHttpResponse<IncreaseScoreResponse> {
  data: IncreaseScoreResponse;
  status: string;

  constructor(status: string, data: IncreaseScoreResponse) {
    super(status, data);
  }
}

class IncreaseScoreResponse {
  score: number;
}
