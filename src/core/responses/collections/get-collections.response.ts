import { ApiProperty } from '@nestjs/swagger';
import { Collection } from '../../entities';
import { DefaultHttpResponse } from '../common';

class GetCollectionsResponse {
  @ApiProperty({
    type: [Collection],
    example: [
      {
        id: '1',
        name: 'Favorite Mangas',
        description: 'A collection of my favorite mangas.',
      },
    ],
  })
  collections: Collection[];
}

export class GetCollectionsHttpResponse extends DefaultHttpResponse<GetCollectionsResponse> {
  @ApiProperty({ example: 'success' })
  status: string;

  @ApiProperty({ type: GetCollectionsResponse })
  data: GetCollectionsResponse;

  constructor(status: string, data: GetCollectionsResponse) {
    super(status, data);
  }
}
