import { Collection, CollectionManga } from '../../entities';
import { DefaultHttpResponse } from '../common';

export class AddMangaToCollectionHttpResponse extends DefaultHttpResponse<AddMangaToCollectionResponse> {
  status: string;
  data: AddMangaToCollectionResponse;

  constructor(status: string, data: AddMangaToCollectionResponse) {
    super(status, data);
  }
}

class AddMangaToCollectionResponse {
  manga: CollectionManga;
  collection: Collection;
}
