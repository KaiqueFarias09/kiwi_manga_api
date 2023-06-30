import { AccessTokenEntity } from '../../entities';
import { DefaultHttpResponse } from '../common';

export class SigninHttpResponse extends DefaultHttpResponse<AccessTokenEntity> {
  status: string;
  data: AccessTokenEntity;

  constructor(status: string, data: AccessTokenEntity) {
    super(status, data);
  }
}
