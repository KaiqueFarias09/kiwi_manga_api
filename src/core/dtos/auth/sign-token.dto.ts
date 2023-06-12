import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignTokenDto {
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsEmail()
  user_email: string;
}
