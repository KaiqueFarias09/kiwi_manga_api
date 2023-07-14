import { ApiProperty } from '@nestjs/swagger';
import { MangaSimplified } from '../../entities';
import { DefaultHttpResponse } from '../common';

class GetMorePagesFromCombinationResponse {
  @ApiProperty({
    type: MangaSimplified,
    isArray: true,
    description: 'Array of simplified manga entities',
    example: [
      {
        id: '1',
        name: 'Manga name',
        cover: 'Cover URL',
        url: 'Manga URL',
        synopsis: 'Manga synopsis',
        hasCover: true,
      },
    ],
  })
  mangas: MangaSimplified[];
}

export class GetMorePagesFromCombinationsHttpResponse
  implements DefaultHttpResponse<GetMorePagesFromCombinationResponse>
{
  @ApiProperty({
    example: {
      mangas: [
        {
          id: '1',
          name: 'Manga name',
          cover: 'Cover URL',
          url: 'Manga URL',
          synopsis: 'Manga synopsis',
          hasCover: true,
        },
      ],
    },
    description: 'Object containing an array of simplified manga entities',
  })
  data: GetMorePagesFromCombinationResponse;

  @ApiProperty({ example: 'success' })
  status: string;

  constructor(data: GetMorePagesFromCombinationResponse, status: string) {
    this.data = data;
    this.status = status;
  }
}
