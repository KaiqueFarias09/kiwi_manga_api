import { ApiProperty } from '@nestjs/swagger';
import { Chapter } from '../../entities';
import { DefaultHttpResponse } from '../common';

class GetChaptersResponse {
  @ApiProperty({
    type: Chapter,
    isArray: true,
    example: [
      {
        name: 'Chapter 1',
        url: 'https://example.com/chapter1',
        releasedAt: '2023-06-30T12:00:00Z',
        pages: [
          'https://example.com/page1.jpg',
          'https://example.com/page2.jpg',
        ],
      },
      {
        name: 'Chapter 2',
        url: 'https://example.com/chapter2',
        releasedAt: '2023-06-31T12:00:00Z',
        pages: [
          'https://example.com/page3.jpg',
          'https://example.com/page4.jpg',
        ],
      },
    ],
  })
  chapters: Chapter[];
}

export class GetChaptersHttpResponse extends DefaultHttpResponse<GetChaptersResponse> {
  @ApiProperty({ example: 'success' })
  status: string;

  @ApiProperty({ type: GetChaptersResponse })
  data: GetChaptersResponse;

  constructor(status: string, data: GetChaptersResponse) {
    super(status, data);
  }
}
