import { Chapter } from '../../entities';
import { DefaultHttpResponse } from '../common';

export class GetChaptersHttpResponse extends DefaultHttpResponse<GetChaptersResponse> {
  data: GetChaptersResponse;
  status: string;

  constructor(status: string, data: GetChaptersResponse) {
    super(status, data);
  }
}

class GetChaptersResponse {
  chapters: Chapter[];
}
