import { Inject, Injectable } from '@nestjs/common';
import { IUsersRepositoryAbstract } from '../../core/abstracts';
import { SuccessEntity, WasDeletedEntity } from '../../core/entities';

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
  }): Promise<SuccessEntity> {
    return this.usersRepository.updatePassword({ userId, newPassword });
  }
  updateNickname({
    userId,
    newNickname,
  }: {
    userId: string;
    newNickname: string;
  }): Promise<SuccessEntity> {
    return this.usersRepository.updateNickname({ userId, newNickname });
  }
  updateEmail({
    userId,
    newEmail,
  }: {
    userId: string;
    newEmail: string;
  }): Promise<SuccessEntity> {
    return this.usersRepository.updateEmail({ userId, newEmail });
  }
  deleteAccount(userId: string): Promise<WasDeletedEntity> {
    return this.usersRepository.deleteAccount(userId);
  }
}
