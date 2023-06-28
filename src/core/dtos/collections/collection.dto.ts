import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

const phrase = 'must be under 255 characters';
const descriptionPhrase = `Collection description ${phrase}`;
const namePhrase = `Collection name ${phrase}`;

export class CollectionDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  id?: string;

  @ApiProperty({
    description: namePhrase,
  })
  @IsString()
  @IsNotEmpty()
  @Length(0, 256, {
    message: namePhrase,
  })
  name: string;

  @ApiProperty({
    description: descriptionPhrase,
  })
  @IsString()
  @IsNotEmpty()
  @Length(0, 256, {
    message: descriptionPhrase,
  })
  description: string;
}
