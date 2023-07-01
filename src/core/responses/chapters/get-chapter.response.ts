import { ApiProperty } from '@nestjs/swagger';
import { DefaultHttpResponse } from '../common';

class GetChapterResponse {
  @ApiProperty({
    type: 'array',
    items: { type: 'string' },
    example: [
      'https://example.com/page1.jpg',
      'https://example.com/page2.jpg',
      'https://example.com/page3.jpg',
    ],
  })
  pages: string[];
}

export class GetChapterHttpResponse extends DefaultHttpResponse<GetChapterResponse> {
  @ApiProperty({ example: 'success' })
  status: string;

  @ApiProperty({ type: GetChapterResponse })
  data: GetChapterResponse;

  constructor(status: string, data: GetChapterResponse) {
    super(status, data);
  }
}
