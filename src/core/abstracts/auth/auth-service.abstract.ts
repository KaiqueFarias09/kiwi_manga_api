import { SigninDto, SignupDto } from '../../dtos/';
import { AutenticationTokens } from '../../types';

export abstract class IAuthService {
  abstract signup(signupDto: SignupDto): Promise<AutenticationTokens>;
  abstract signin(signinDto: SigninDto): Promise<AutenticationTokens>;
  abstract logout(userId: string): Promise<boolean>;
  abstract refreshTokens(
    userId: string,
    refreshToken: string,
  ): Promise<AutenticationTokens>;
}
