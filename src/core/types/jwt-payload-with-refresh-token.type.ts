import { JwtPayload } from './jwt-payload.type';

export class JwtPayloadWithRefreshToken {
  payload: JwtPayload;
  refreshToken: string;
}
