import { ApiProperty } from '@nestjs/swagger';
import { HttpResponseStatus } from '../../enums';
import { DeleteHttpResponse } from '../common';

export class DeleteAccountHttpResponse extends DeleteHttpResponse {
  @ApiProperty({ example: HttpResponseStatus.SUCCESS })
  status: string;

  @ApiProperty({ example: 'Account deleted successfully' })
  message: string;

  constructor(status: string, message: string) {
    super(status, message);
  }
}
