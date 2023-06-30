import {
  UpdateEmailResponseEntity,
  UpdateNicknameResponseEntity,
  UpdatePasswordResponseEntity,
} from '../../entities';

export abstract class IUsersRepositoryAbstract {
  abstract updatePassword({
    userId,
    newPassword,
  }: {
    userId: string;
    newPassword: string;
  }): Promise<UpdatePasswordResponseEntity>;

  abstract updateNickname({
    userId,
    newNickname,
  }: {
    userId: string;
    newNickname: string;
  }): Promise<UpdateNicknameResponseEntity>;

  abstract updateEmail({
    userId,
    newEmail,
  }: {
    userId: string;
    newEmail: string;
  }): Promise<UpdateEmailResponseEntity>;

  abstract deleteAccount(userId: string): Promise<void>;
}
