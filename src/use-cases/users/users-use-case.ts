import { Inject, Injectable } from '@nestjs/common';
import { IUsersRepositoryAbstract } from '../../core/abstracts';
import {
  UpdateEmailResponseEntity,
  UpdateNicknameResponseEntity,
  UpdatePasswordResponseEntity,
} from '../../core/entities';

@Injectable()
export class UsersUseCase {
  usersRepository: IUsersRepositoryAbstract;
  constructor(
    @Inject(IUsersRepositoryAbstract) usersRepository: IUsersRepositoryAbstract,
  ) {
    this.usersRepository = usersRepository;
  }
  updatePassword({
    userId,
    newPassword,
  }: {
    userId: string;
    newPassword: string;
  }): Promise<UpdatePasswordResponseEntity> {
    return this.usersRepository.updatePassword({ userId, newPassword });
  }
  updateNickname({
    userId,
    newNickname,
  }: {
    userId: string;
    newNickname: string;
  }): Promise<UpdateNicknameResponseEntity> {
    return this.usersRepository.updateNickname({ userId, newNickname });
  }
  updateEmail({
    userId,
    newEmail,
  }: {
    userId: string;
    newEmail: string;
  }): Promise<UpdateEmailResponseEntity> {
    return this.usersRepository.updateEmail({ userId, newEmail });
  }

  deleteAccount(userId: string): Promise<void> {
    return this.usersRepository.deleteAccount(userId);
  }
}
