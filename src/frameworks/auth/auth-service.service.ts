import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { v4 as uuid } from 'uuid';

import { IAuthService } from '../../core/abstracts/';
import { SignupDto, SigninDto, SignTokenDto } from '../../core/dtos';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService implements IAuthService {
  prisma: PrismaService;
  jwt: JwtService;
  config: ConfigService;

  constructor(
    @Inject(PrismaService) prisma: PrismaService,
    @Inject(JwtService) jwt: JwtService,
    @Inject(ConfigService) config: ConfigService,
  ) {
    this.prisma = prisma;
    this.jwt = jwt;
    this.config = config;
  }

  async signup(signupDto: SignupDto) {
    // generate the password hash
    const hash = await argon.hash(signupDto.password);
    // save the new user in the db
    const id = uuid();
    try {
      const user = await this.prisma.user.create({
        data: {
          id: id,
          nickname: signupDto.name,
          email: signupDto.email,
          password: hash,
          profile_pic: '',
          score: 0,
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
