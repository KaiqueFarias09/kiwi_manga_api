import { Injectable, Logger } from '@nestjs/common';
import * as argon from 'argon2';
import { IUsersRepositoryAbstract } from '../../core/abstracts';
import { SuccessEntity, WasDeletedEntity } from '../../core/entities';
import { PostgresService } from '../postgres-prisma/postgres-prisma.service';

@Injectable()
export class UsersServiceService implements IUsersRepositoryAbstract {
  private logger = new Logger('UsersServiceService');
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
  }): Promise<SuccessEntity> {
    try {
      const hash = await argon.hash(newPassword);
      await this.postgresService.user.update({
        where: {
          id: userId,
        },
        data: {
          password: hash,
        },
      });
      return { sucess: true };
    } catch (error) {
      return { sucess: false };
    }
  }
  async updateNickname({
    userId,
    newNickname,
  }: {
    userId: string;
    newNickname: string;
  }): Promise<SuccessEntity> {
    try {
      await this.postgresService.user.update({
        where: {
          id: userId,
        },
        data: {
          nickname: newNickname,
        },
      });
      return { sucess: true };
    } catch (error) {
      return { sucess: false };
    }
  }
  async updateEmail({
    userId,
    newEmail,
  }: {
    userId: string;
    newEmail: string;
  }): Promise<SuccessEntity> {
    try {
      await this.postgresService.user.update({
        where: {
          id: userId,
        },
        data: {
          email: newEmail,
        },
      });
      return { sucess: true };
    } catch (error) {
      return { sucess: false };
    }
  }
  async deleteAccount(userId: string): Promise<WasDeletedEntity> {
    try {
      await this.postgresService.user.delete({
        where: {
          id: userId,
        },
      });
      return { deleted: true };
    } catch (error) {
      return { deleted: false };
    }
  }
}
