import { IsArray, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class QueryDto {
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
