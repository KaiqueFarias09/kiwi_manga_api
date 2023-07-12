import { Inject, Injectable } from '@nestjs/common';
import { IAuthService } from '../../core/abstracts';
import { SigninDto, SignupDto } from '../../core/dtos';
import { AutenticationTokens } from '../../core/types';

@Injectable()
export class AuthServiceUseCases {
  auth: IAuthService;
  constructor(@Inject(IAuthService) authService: IAuthService) {
    this.auth = authService;
  }

  signup(signupDto: SignupDto) {
    return this.auth.signup(signupDto);
  }
  signin(signinDto: SigninDto) {
    return this.auth.signin(signinDto);
  }

  logout(userId: string): Promise<boolean> {
    return this.auth.logout(userId);
  }

  refreshTokens(
    userId: string,
    refreshToken: string,
  ): Promise<AutenticationTokens> {
    return this.auth.refreshTokens(userId, refreshToken);
  }
}
