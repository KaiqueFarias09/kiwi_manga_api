import { SuccessEntity, WasDeletedEntity } from '../../entities';

export abstract class IUsersRepositoryAbstract {
  abstract updatePassword({
    userId,
    newPassword,
  }: {
    userId: string;
    newPassword: string;
  }): Promise<SuccessEntity>;

  abstract updateNickname({
    userId,
    newNickname,
  }: {
    userId: string;
    newNickname: string;
  }): Promise<SuccessEntity>;

  abstract updateEmail({
    userId,
    newEmail,
  }: {
    userId: string;
    newEmail: string;
  }): Promise<SuccessEntity>;

  abstract deleteAccount(userId: string): Promise<WasDeletedEntity>;
}
