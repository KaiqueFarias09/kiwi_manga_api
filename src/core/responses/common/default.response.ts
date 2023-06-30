import { ApiProperty } from '@nestjs/swagger';

export class DefaultHttpResponse<T> {
  @ApiProperty()
  status: string;

  @ApiProperty()
  data: T;

  constructor(status: string, data: T) {
    this.status = status;
    this.data = data;
  }
}
