import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IAuthService } from '../../core/abstracts/';
import { SigninDto, SignTokenDto, SignupDto } from '../../core/dtos';
import { PostgresService } from '../postgres-prisma/postgres-prisma.service';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class AuthService implements IAuthService {
  prisma: PostgresService;
  jwt: JwtService;
  config: ConfigService;

  constructor(
    @Inject(PostgresService) prisma: PostgresService,
    @Inject(JwtService) jwt: JwtService,
    @Inject(ConfigService) config: ConfigService,
  ) {
    this.prisma = prisma;
    this.jwt = jwt;
    this.config = config;
  }

  async signup(signupDto: SignupDto) {
    const hash = await argon.hash(signupDto.password);
    try {
      const user = await this.prisma.user.create({
        data: {
          nickname: signupDto.nickname,
          email: signupDto.email,
          password: hash,
        },
      });
      return this.signToken({ user_id: user.id, user_email: user.email });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async signin(signinDto: SigninDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: signinDto.email,
      },
    });
    if (!user) throw new ForbiddenException('Credentials incorrect');
    const pwMatches = await argon.verify(user.password, signinDto.password);
    if (!pwMatches) throw new ForbiddenException('Credentials incorrect');
    return this.signToken({ user_id: user.id, user_email: user.email });
  }

  async signToken({
    user_id: userId,
    user_email: email,
  }: SignTokenDto): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    });

    return {
      access_token: token,
    };
  }
}
