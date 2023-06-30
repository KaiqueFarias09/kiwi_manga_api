import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignTokenDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsEmail()
  userEmail: string;
}
