import { ApiProperty } from '@nestjs/swagger';
import { HttpResponseStatus } from '../../enums';
import { DefaultHttpResponse } from '../common';

class UpdateNicknameResponse {
  @ApiProperty({
    type: 'object',
    example: { newNickname: 'new_nickname', id: '1' },
  })
  user: { newNickname: string; id: string };
}

export class UpdateNicknameHttpResponse extends DefaultHttpResponse<UpdateNicknameResponse> {
  @ApiProperty({ example: HttpResponseStatus.SUCCESS })
  status: string;

  @ApiProperty({ type: UpdateNicknameResponse })
  data: UpdateNicknameResponse;

  constructor(status: string, data: UpdateNicknameResponse) {
    super(status, data);
  }
}
