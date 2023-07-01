import { ApiProperty } from '@nestjs/swagger';
import { PodiumEntity } from '../../entities';
import { DefaultHttpResponse } from '../common';

export class GetPodiumHttpResponse extends DefaultHttpResponse<PodiumEntity> {
  @ApiProperty({ example: 'success' })
  status: string;

  @ApiProperty({
    example: {
      podium: [
        { name: 'John Doe', score: 1200 },
        { name: 'Jane Doe', score: 1150 },
        { name: 'James Doe', score: 1100 },
      ],
      userScore: 1000,
    },
  })
  data: PodiumEntity;

  constructor(status: string, data: PodiumEntity) {
    super(status, data);
  }
}
