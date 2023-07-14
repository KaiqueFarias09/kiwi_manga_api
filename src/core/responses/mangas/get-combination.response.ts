import { ApiProperty } from '@nestjs/swagger';
import { Combination } from '../../entities';
import { DefaultHttpResponse } from '../common';

class GetCombinationResponse {
  @ApiProperty({
    type: Combination,
    isArray: true,
    description: 'Array of combination entities',
  })
  combinations: Combination[];
}

export class GetCombinationHttpResponse
  implements DefaultHttpResponse<GetCombinationResponse>
{
  @ApiProperty({
    example: {
      combinations: [
        // Example of a combination object.
        {
          id: '123',
          name: {
            english: 'English name',
            portuguese: 'Portuguese name',
            german: 'German name',
            french: 'French name',
            spanish: 'Spanish name',
          },
          genres: [1, 2, 3],
          currentPage: 1,
          mangas: [
            // Example of MangaSimplified object.
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
      ],
    },
  })
  data: GetCombinationResponse;

  @ApiProperty({ example: 'success' })
  status: string;

  constructor(data: GetCombinationResponse, status: string) {
    this.data = data;
    this.status = status;
  }
}
