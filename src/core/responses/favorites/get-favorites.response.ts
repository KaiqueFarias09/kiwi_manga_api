import { ApiProperty } from '@nestjs/swagger';
import { CollectionManga } from '../../entities';
import { DefaultHttpResponse } from '../common';
import { HttpResponseStatus } from '../../enums';

class GetFavoritesResponse {
  @ApiProperty({
    type: [CollectionManga],
    example: [
      {
        id: '1',
        name: 'Naruto',
        cover: 'https://example.com/manga/naruto/cover.jpg',
        synopsis: 'Naruto is a ninja from the village of Konoha.',
      },
    ],
  })
  mangas: CollectionManga[];
}

export class GetFavoritesHttpResponse extends DefaultHttpResponse<GetFavoritesResponse> {
  @ApiProperty({ example: HttpResponseStatus.SUCCESS })
  status: string;

  @ApiProperty({ type: GetFavoritesResponse })
  data: GetFavoritesResponse;

  constructor(status: string, data: GetFavoritesResponse) {
    super(status, data);
  }
}
