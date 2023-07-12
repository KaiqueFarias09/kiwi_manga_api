import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { IAuthService } from '../../core/abstracts/';
import { SigninDto, SignupDto } from '../../core/dtos';
import { ResourceAlreadyExistException } from '../../core/errors/';
import { PostgresService } from '../postgres-prisma/postgres-prisma.service';
import { AutenticationTokens, JwtPayload } from '../../core/types';

@Injectable()
export class AuthService implements IAuthService {
  prisma: PostgresService;
  jwtService: JwtService;
  config: ConfigService;

  constructor(
    @Inject(PostgresService) prisma: PostgresService,
    @Inject(JwtService) jwt: JwtService,
    @Inject(ConfigService) config: ConfigService,
  ) {
    this.prisma = prisma;
    this.jwtService = jwt;
    this.config = config;
  }

  async signup(signupDto: SignupDto): Promise<AutenticationTokens> {
    const hash = await argon.hash(signupDto.password);
    const user = await this.prisma.user
      .create({
        data: {
          nickname: signupDto.nickname,
          email: signupDto.email,
          password: hash,
        },
      })
      .catch((error) => {
        if (error.code === 'P2002') {
          throw new ResourceAlreadyExistException();
        }
        throw error;
      });

    const tokens = await this.getTokens({ sub: user.id, email: user.email });
    await this.updateRtHash(user.id, tokens.refreshToken);

    return tokens;
  }

  async signin(signinDto: SigninDto): Promise<AutenticationTokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: signinDto.email,
      },
    });

    if (!user) throw new ForbiddenException('Access Denied');

    const passwordMatches = await argon.verify(
      user.password,
      signinDto.password,
    );
    if (!passwordMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens({ sub: user.id, email: user.email });
    await this.updateRtHash(user.id, tokens.refreshToken);

    return tokens;
  }

  async refreshTokens(
    userId: string,
    refreshToken: string,
  ): Promise<AutenticationTokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user?.hashedRefreshToken)
      throw new ForbiddenException('Access Denied');

    const rtMatches = await argon.verify(user.hashedRefreshToken, refreshToken);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens({ sub: user.id, email: user.email });
    await this.updateRtHash(user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: string): Promise<boolean> {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashedRefreshToken: {
          not: null,
        },
      },
      data: {
        hashedRefreshToken: null,
      },
    });
    return true;
  }

  private async getTokens(payload: JwtPayload): Promise<AutenticationTokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.get<string>('ACESS_TOKEN_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.config.get<string>('REFRESH_TOKEN_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken: at,
      refreshToken: rt,
    };
  }

  private async updateRtHash(userId: string, rt: string): Promise<void> {
    const hash = await argon.hash(rt);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRefreshToken: hash,
      },
    });
  }
}
