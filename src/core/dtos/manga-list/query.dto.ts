import { IsArray, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class QueryDto {
  @ApiProperty({ required: false, isArray: true, type: Array<string> })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split('&');
    } else {
      return value;
    }
  })
  keywords: string[];
}
