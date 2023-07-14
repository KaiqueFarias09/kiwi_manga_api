import { ApiProperty } from '@nestjs/swagger';
import { DeleteHttpResponse } from '../common';

export class LogoutHttpResponse implements DeleteHttpResponse {
  @ApiProperty({ example: 'success' })
  status: string;

  @ApiProperty({ example: 'User logged out successfully' })
  message: string;

  constructor(message: string, status: string) {
    this.status = status;
    this.message = message;
  }
}
