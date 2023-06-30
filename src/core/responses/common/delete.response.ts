import { ApiProperty } from '@nestjs/swagger';

export class DeleteHttpResponse {
  @ApiProperty()
  status: string;

  @ApiProperty()
  message: boolean;

  constructor(status: string, message: boolean) {
    this.status = status;
    this.message = message;
  }
}
