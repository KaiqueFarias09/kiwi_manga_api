import { ApiProperty } from '@nestjs/swagger';

export class DeleteHttpResponse {
  @ApiProperty()
  status: string;

  @ApiProperty()
  message: string;

  constructor(status: string, message: string) {
    this.status = status;
    this.message = message;
  }
}
