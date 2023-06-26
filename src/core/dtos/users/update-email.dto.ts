import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateEmailDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  newEmail: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}
