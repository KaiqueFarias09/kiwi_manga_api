import { ApiProperty } from '@nestjs/swagger';
import { CollectionManga } from '../../entities';
import { DefaultHttpResponse } from '../common';

class GetMangasFromCollectionResponse {
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

export class GetMangasFromCollectionHttpResponse extends DefaultHttpResponse<GetMangasFromCollectionResponse> {
  @ApiProperty({ example: 'success' })
  status: string;

  @ApiProperty({ type: GetMangasFromCollectionResponse })
  data: GetMangasFromCollectionResponse;

  constructor(status: string, data: GetMangasFromCollectionResponse) {
    super(status, data);
  }
}
