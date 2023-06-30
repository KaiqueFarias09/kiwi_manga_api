import { CollectionDto } from '../../dtos';
import { DefaultHttpResponse } from '../common';

export class CreateCollectionHttpResponse extends DefaultHttpResponse<CreateCollectionResponse> {
  status: string;
  data: CreateCollectionResponse;

  constructor(status: string, data: CreateCollectionResponse) {
    super(status, data);
  }
}

class CreateCollectionResponse {
  collection: CollectionDto;
}
