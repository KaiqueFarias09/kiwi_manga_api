import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class IncreaseScoreDto {
  @IsNumber()
  @ApiProperty()
  increase: number;
}
