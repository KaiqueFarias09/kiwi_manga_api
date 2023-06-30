import { Collection } from '../../entities';
import { DefaultHttpResponse } from '../common';

export class GetCollectionsHttpResponse extends DefaultHttpResponse<GetCollectionsResponse> {
  status: string;
  data: GetCollectionsResponse;

  constructor(status: string, data: GetCollectionsResponse) {
    super(status, data);
  }
}

class GetCollectionsResponse {
  collections: Collection[];
}
