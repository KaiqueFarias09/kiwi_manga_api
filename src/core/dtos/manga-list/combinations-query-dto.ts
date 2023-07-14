import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsOptional } from 'class-validator';

export class CombinationsQueryDto {
  @ApiProperty({
    required: false,
    example: ['53558&284647&72110'],
    description:
      'The existingCombinationsIds property represents an optional array of existing combinations identifiers. It is used when the API client wishes to retrieve a new set of manga combinations, excluding the ones specified in this array. If provided, the server will filter out these combinations from the result set. If it is not provided, the server will return a random set of manga combinations. The provided IDs should be separated by an "&" character when used as a query parameter in a string format.',
    isArray: true,
    type: 'Array<string>',
  })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split('&');
    } else {
      return value;
    }
  })
  existingCombinationsIds: string[];
}
