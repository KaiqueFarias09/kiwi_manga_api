import { UpdateProfilePicEntity } from '../../entities/';

export abstract class IProfilePicRepository {
  abstract findProfilePic(userId: string): Promise<string>;
  abstract updateProfilePicDto(
    updateProfilePicEntity: UpdateProfilePicEntity,
  ): Promise<string>;
}
