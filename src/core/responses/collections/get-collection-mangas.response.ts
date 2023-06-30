import { CollectionManga } from '../../entities';
import { DefaultHttpResponse } from '../common';

export class GetMangasFromCollectionHttpResponse extends DefaultHttpResponse<GetMangasFromCollectionResponse> {
  status: string;
  data: GetMangasFromCollectionResponse;

  constructor(status: string, data: GetMangasFromCollectionResponse) {
    super(status, data);
  }
}

class GetMangasFromCollectionResponse {
  mangas: CollectionManga[];
}
