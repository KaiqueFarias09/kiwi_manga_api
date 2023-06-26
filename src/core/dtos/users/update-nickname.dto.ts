import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateNicknameDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  newNickname: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}
