import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class QueryDto {
  @ApiProperty({
    required: true,
    example: 'Boruto',
    description:
      'The keyword property represents the search term to be used when querying for specific manga. This could be a manga title, author, or any related keyword. Although it is marked as optional for validation, it is essentially needed for a successful API request. In the given example, "Boruto" is the keyword used to fetch mangas related to this term.',
  })
  @IsNotEmpty()
  @IsString()
  keyword: string;
}
