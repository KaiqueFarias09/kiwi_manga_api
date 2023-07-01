import { ApiProperty } from '@nestjs/swagger';
import { HttpResponseStatus } from '../../enums';
import { DeleteHttpResponse } from '../common';

export class DeleteFavoriteHttpResponse extends DeleteHttpResponse {
  @ApiProperty({ example: HttpResponseStatus.SUCCESS })
  status: string;

  @ApiProperty({ example: 'Manga removed from favorites' })
  message: string;

  constructor(status: string, message: string) {
    super(status, message);
  }
}
