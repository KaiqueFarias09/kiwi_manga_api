import { ApiProperty } from '@nestjs/swagger';
import { HttpResponseStatus } from '../../enums';
import { DeleteHttpResponse } from '../common';

export class DeleteCollectionHttpResponse extends DeleteHttpResponse {
  @ApiProperty({ example: HttpResponseStatus.SUCCESS })
  status: string;

  @ApiProperty({ example: 'Collection deleted successfully' })
  message: string;

  constructor(status: string, message: string) {
    super(status, message);
  }
}
