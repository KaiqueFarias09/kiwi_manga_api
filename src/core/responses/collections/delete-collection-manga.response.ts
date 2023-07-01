import { ApiProperty } from '@nestjs/swagger';
import { HttpResponseStatus } from '../../enums';
import { DeleteHttpResponse } from '../common';

export class DeleteMangaFromCollectionHttpResponse extends DeleteHttpResponse {
  @ApiProperty({ example: HttpResponseStatus.SUCCESS })
  status: string;

  @ApiProperty({ example: 'Manga deleted from collection successfully' })
  message: string;

  constructor(status: string, message: string) {
    super(status, message);
  }
}
