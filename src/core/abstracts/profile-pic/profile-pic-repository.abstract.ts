export abstract class IProfilePicRepository {
  abstract findProfilePic(userId: string): Promise<string>;
  abstract saveProfilePic(userId: string): Promise<string>;
}
