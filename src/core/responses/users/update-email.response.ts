import { ApiProperty } from '@nestjs/swagger';
import { DefaultHttpResponse } from '../common';
import { HttpResponseStatus } from '../../enums';

class UpdateEmailResponse {
  @ApiProperty({
    type: 'object',
    example: { newEmail: 'updated.email@example.com', id: '1' },
  })
  user: { newEmail: string; id: string };
}

export class UpdateEmailHttpResponse extends DefaultHttpResponse<UpdateEmailResponse> {
  @ApiProperty({ example: HttpResponseStatus.SUCCESS })
  status: string;

  @ApiProperty({ type: UpdateEmailResponse })
  data: UpdateEmailResponse;

  constructor(status: string, data: UpdateEmailResponse) {
    super(status, data);
  }
}
