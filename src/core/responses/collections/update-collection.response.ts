import { ApiProperty } from '@nestjs/swagger';
import { Collection } from '../../entities';
import { DefaultHttpResponse } from '../common';

class UpdateCollectionResponse {
  @ApiProperty({
    type: Collection,
    example: {
      id: '1',
      name: 'Updated Favorite Mangas',
      description: 'An updated description of my favorite mangas.',
    },
  })
  collection: Collection;
}

export class UpdateCollectionHttpResponse extends DefaultHttpResponse<UpdateCollectionResponse> {
  @ApiProperty({ example: 'success' })
  status: string;

  @ApiProperty({ type: UpdateCollectionResponse })
  data: UpdateCollectionResponse;

  constructor(status: string, data: UpdateCollectionResponse) {
    super(status, data);
  }
}
