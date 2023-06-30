import { SigninDto, SignupDto } from '../../dtos/';
import { AccessTokenEntity } from '../../entities';

export abstract class IAuthService {
  abstract signup(signupDto: SignupDto): Promise<AccessTokenEntity>;
  abstract signin(signinDto: SigninDto): Promise<AccessTokenEntity>;
}
