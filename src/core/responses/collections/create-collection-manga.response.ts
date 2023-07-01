import { ApiProperty } from '@nestjs/swagger';
import { Collection, CollectionManga } from '../../entities';
import { DefaultHttpResponse } from '../common';

class AddMangaToCollectionResponse {
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

  @ApiProperty({
    type: Collection,
    example: {
      id: '1',
      name: 'Favorite Mangas',
      description: 'A collection of my favorite mangas.',
    },
  })
  collection: Collection;
}

export class AddMangaToCollectionHttpResponse extends DefaultHttpResponse<AddMangaToCollectionResponse> {
  @ApiProperty({ example: 'success' })
  status: string;

  @ApiProperty({ type: AddMangaToCollectionResponse })
  data: AddMangaToCollectionResponse;

  constructor(status: string, data: AddMangaToCollectionResponse) {
    super(status, data);
  }
}
