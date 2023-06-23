import { IsNumber } from 'class-validator';

export class IncreaseScoreDto {
  @IsNumber()
  increase = 1;
}
