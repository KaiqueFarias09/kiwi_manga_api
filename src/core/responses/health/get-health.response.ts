import { ApiProperty } from '@nestjs/swagger';
import { HttpResponseStatus } from '../../enums';
import { DefaultHttpResponse } from '../common';

class GetHealthResponse {
  @ApiProperty({ example: '0.0.1' })
  version: string;
}

export class GetHealthHttpResponse extends DefaultHttpResponse<GetHealthResponse> {
  @ApiProperty({ example: HttpResponseStatus.SUCCESS })
  status: string;

  @ApiProperty({ type: GetHealthResponse })
  data: GetHealthResponse;

  constructor(status: string, data: GetHealthResponse) {
    super(status, data);
  }
}
