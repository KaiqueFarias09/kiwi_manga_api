import { ApiProperty } from '@nestjs/swagger';
import { AuthenticationTokens } from 'src/core/types';
import { DefaultHttpResponse } from '../common';

export class SignupHttpResponse extends DefaultHttpResponse<AuthenticationTokens> {
  @ApiProperty({ example: 'success' })
  status: string;

  @ApiProperty({
    example: {
      accessToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
      refreshToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.qwdJ5f5F6DZXJQVtFGN7FJ7Kk9z4TOwTJaV6bOJ6abc',
    },
  })
  data: AuthenticationTokens;

  constructor(status: string, data: AuthenticationTokens) {
    super(status, data);
  }
}
