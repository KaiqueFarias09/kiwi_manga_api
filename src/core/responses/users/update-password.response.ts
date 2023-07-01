import { ApiProperty } from '@nestjs/swagger';
import { HttpResponseStatus } from '../../enums';
import { DefaultHttpResponse } from '../common';

class UpdatePasswordResponse {
  @ApiProperty({
    type: 'object',
    example: { id: '1', nickname: 'userNickname' },
  })
  user: { id: string; nickname: string };
}

export class UpdatePasswordHttpResponse extends DefaultHttpResponse<UpdatePasswordResponse> {
  @ApiProperty({ example: HttpResponseStatus.SUCCESS })
  status: string;

  @ApiProperty({ type: UpdatePasswordResponse })
  data: UpdatePasswordResponse;

  constructor(status: string, data: UpdatePasswordResponse) {
    super(status, data);
  }
}
