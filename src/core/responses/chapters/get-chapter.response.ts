import { DefaultHttpResponse } from '../common';

export class GetChapterHttpResponse extends DefaultHttpResponse<GetChapterResponse> {
  data: GetChapterResponse;
  status: string;

  constructor(status: string, data: GetChapterResponse) {
    super(status, data);
  }
}

class GetChapterResponse {
  pages: string[];
}
