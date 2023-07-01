import { ApiProperty } from '@nestjs/swagger';
import { AccessTokenEntity } from '../../entities';
import { DefaultHttpResponse } from '../common';

export class SigninHttpResponse extends DefaultHttpResponse<AccessTokenEntity> {
  @ApiProperty({ example: 'success' })
  status: string;

  @ApiProperty({
    example: {
      accessToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    },
  })
  data: AccessTokenEntity;

  constructor(status: string, data: AccessTokenEntity) {
    super(status, data);
  }
}
