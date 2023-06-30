import { CollectionManga } from '../../entities';
import { DefaultHttpResponse } from '../common';

export class GetFavoritesHttpResponse extends DefaultHttpResponse<GetFavoritesResponse> {
  data: GetFavoritesResponse;
  status: string;

  constructor(status: string, data: GetFavoritesResponse) {
    super(status, data);
  }
}

class GetFavoritesResponse {
  mangas: CollectionManga[];
}
