import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { AccessTokenEntity } from '../../core/entities';
import { IAuthService } from '../../core/abstracts/';
import { SignTokenDto, SigninDto, SignupDto } from '../../core/dtos';
import { ResourceAlreadyExistException } from '../../core/errors/';
import { PostgresService } from '../postgres-prisma/postgres-prisma.service';

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

  async signup(signupDto: SignupDto): Promise<AccessTokenEntity> {
    const hash = await argon.hash(signupDto.password);
    try {
      const user = await this.prisma.user.create({
        data: {
          nickname: signupDto.nickname,
          email: signupDto.email,
          password: hash,
        },
      });
      return this.signToken({ userId: user.id, userEmail: user.email });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ResourceAlreadyExistException();
      }
      throw error;
    }
  }

  async signin(signinDto: SigninDto): Promise<AccessTokenEntity> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: signinDto.email,
      },
    });

    if (!user) throw new UnauthorizedException('Credentials incorrect');
    const pwMatches = await argon.verify(user.password, signinDto.password);
    if (!pwMatches) throw new UnauthorizedException('Credentials incorrect');

    const accessToken = await this.signToken({
      userId: user.id,
      userEmail: user.email,
    });
    return {
      accessToken: accessToken.accessToken,
    };
  }

  async signToken({
    userId: userId,
    userEmail: email,
  }: SignTokenDto): Promise<{ accessToken: string }> {
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
      accessToken: token,
    };
  }
}
