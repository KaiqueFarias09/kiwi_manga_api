import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Validate } from 'class-validator';

class IsNumberValue {
  validate(value: any) {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }
  defaultMessage() {
    return 'Must be a number';
  }
}

export class GetMorePagesFromCombinationQueryDto {
  @ApiProperty({
    required: true,
    example: 123,
    description:
      'The cursor property represents the ID of the last manga in the current batch of results. This property is used for pagination purposes in the API request, which retrieves the next set of results from the queried data. The cursor value is a numerical integer that should be passed from the response of the previous request. If the cursor is not included or is null in the response, it means there are no more pages of results.',
  })
  @IsNotEmpty()
  @Validate(IsNumberValue)
  cursor: number;
}
