import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CollectionIdDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
