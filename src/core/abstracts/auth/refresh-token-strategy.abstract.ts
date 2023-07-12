import { Request } from 'express';

import { JwtPayload, JwtPayloadWithRefreshToken } from '../../types';

export abstract class IRefreshTokenStrategy {
  abstract validate(
    req: Request,
    payload: JwtPayload,
  ): JwtPayloadWithRefreshToken;
}
