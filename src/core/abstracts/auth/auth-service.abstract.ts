import { SigninDto, SignupDto } from '../../dtos/';

export abstract class IAuthService {
  abstract signup(signupDto: SignupDto);
  abstract signin(signinDto: SigninDto);
}
