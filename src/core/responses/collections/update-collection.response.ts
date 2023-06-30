import { Collection } from '../../entities';
import { DefaultHttpResponse } from '../common';

export class UpdateCollectionHttpResponse extends DefaultHttpResponse<UpdateCollectionResponse> {
  status: string;
  data: UpdateCollectionResponse;

  constructor(status: string, data: UpdateCollectionResponse) {
    super(status, data);
  }
}

class UpdateCollectionResponse {
  collection: Collection;
}
