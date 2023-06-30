import { Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { IUsersRepositoryAbstract } from '../../core/abstracts';
import {
  UpdateEmailResponseEntity,
  UpdateNicknameResponseEntity,
  UpdatePasswordResponseEntity,
} from '../../core/entities';
import { PostgresService } from '../postgres-prisma/postgres-prisma.service';

@Injectable()
export class UsersServiceService implements IUsersRepositoryAbstract {
  postgresService: PostgresService;
  constructor(postgresService: PostgresService) {
    this.postgresService = postgresService;
  }
  async updatePassword({
    userId,
    newPassword,
  }: {
    userId: string;
    newPassword: string;
  }): Promise<UpdatePasswordResponseEntity> {
    try {
      const hash = await argon.hash(newPassword);
      const user = await this.postgresService.user.update({
        where: {
          id: userId,
        },
        data: {
          password: hash,
        },
      });
      return { nickname: user.nickname, userId: user.id };
    } catch (error) {
      throw error;
    }
  }
  async updateNickname({
    userId,
    newNickname,
  }: {
    userId: string;
    newNickname: string;
  }): Promise<UpdateNicknameResponseEntity> {
    try {
      const user = await this.postgresService.user.update({
        where: {
          id: userId,
        },
        data: {
          nickname: newNickname,
        },
      });

      return {
        newNickname: user.nickname,
        userId: user.id,
      };
    } catch (error) {
      throw error;
    }
  }
  async updateEmail({
    userId,
    newEmail,
  }: {
    userId: string;
    newEmail: string;
  }): Promise<UpdateEmailResponseEntity> {
    try {
      const user = await this.postgresService.user.update({
        where: {
          id: userId,
        },
        data: {
          email: newEmail,
        },
      });
      return {
        newEmail: user.email,
        userId: user.id,
      };
    } catch (error) {
      throw error;
    }
  }
  async deleteAccount(userId: string): Promise<void> {
    try {
      await this.postgresService.user.delete({
        where: {
          id: userId,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
