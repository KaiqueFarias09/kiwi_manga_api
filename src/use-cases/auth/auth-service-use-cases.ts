import { Inject, Injectable } from '@nestjs/common';
import { IAuthService } from '../../core/abstracts';
import { SigninDto, SignupDto } from '../../core/dtos';

@Injectable()
export class AuthServiceUseCases implements IAuthService {
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
}
