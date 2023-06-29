import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class IncreaseScoreDto {
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  increase: number;
}
