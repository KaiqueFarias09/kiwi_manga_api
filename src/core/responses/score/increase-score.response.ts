import { ApiProperty } from '@nestjs/swagger';
import { DefaultHttpResponse } from '../common';

class IncreaseScoreResponse {
  @ApiProperty({ example: 1250 })
  score: number;
}

export class IncreaseScoreHttpResponse extends DefaultHttpResponse<IncreaseScoreResponse> {
  @ApiProperty({ example: 'success' })
  status: string;

  @ApiProperty({ example: { score: 1250 } })
  data: IncreaseScoreResponse;

  constructor(status: string, data: IncreaseScoreResponse) {
    super(status, data);
  }
}
