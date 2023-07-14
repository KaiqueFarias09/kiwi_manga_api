import { SigninDto, SignupDto } from '../../dtos/';
import { AuthenticationTokens } from '../../types';

export abstract class IAuthService {
  abstract signup(signupDto: SignupDto): Promise<AuthenticationTokens>;
  abstract signin(signinDto: SigninDto): Promise<AuthenticationTokens>;
  abstract logout(userId: string): Promise<boolean>;
  abstract refreshTokens(
    userId: string,
    refreshToken: string,
  ): Promise<AuthenticationTokens>;
}
