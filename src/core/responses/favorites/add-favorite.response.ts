import { ApiProperty } from '@nestjs/swagger';
import { HttpResponseStatus } from '../../enums';
import { CollectionManga } from '../../entities';
import { DefaultHttpResponse } from '../common';

class AddFavoriteResponse {
  @ApiProperty({
    type: CollectionManga,
    example: {
      id: '1',
      name: 'Naruto',
      cover: 'https://example.com/manga/naruto/cover.jpg',
      synopsis: 'Naruto is a ninja from the village of Konoha.',
    },
  })
  manga: CollectionManga;
}

export class AddFavoriteHttpResponse extends DefaultHttpResponse<AddFavoriteResponse> {
  @ApiProperty({ example: HttpResponseStatus.SUCCESS })
  status: string;

  @ApiProperty({ type: AddFavoriteResponse })
  data: AddFavoriteResponse;

  constructor(status: string, data: AddFavoriteResponse) {
    super(status, data);
  }
}
