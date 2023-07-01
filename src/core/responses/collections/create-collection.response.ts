import { ApiProperty } from '@nestjs/swagger';
import { CollectionDto } from '../../dtos';
import { DefaultHttpResponse } from '../common';

class CreateCollectionResponse {
  @ApiProperty({
    type: CollectionDto,
    example: {
      id: '1',
      name: 'Favorite Mangas',
      description: 'A collection of my favorite mangas.',
    },
  })
  collection: CollectionDto;
}

export class CreateCollectionHttpResponse extends DefaultHttpResponse<CreateCollectionResponse> {
  @ApiProperty({ example: 'success' })
  status: string;

  @ApiProperty({ type: CreateCollectionResponse })
  data: CreateCollectionResponse;

  constructor(status: string, data: CreateCollectionResponse) {
    super(status, data);
  }
}
