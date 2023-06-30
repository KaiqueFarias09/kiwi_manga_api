import { CollectionManga } from '../../entities';
import { DefaultHttpResponse } from '../common';

export class AddFavoriteHttpResponse extends DefaultHttpResponse<AddFavoriteResponse> {
  data: AddFavoriteResponse;
  status: string;

  constructor(status: string, data: AddFavoriteResponse) {
    super(status, data);
  }
}

class AddFavoriteResponse {
  manga: CollectionManga;
}
