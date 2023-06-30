import { ApiProperty } from '@nestjs/swagger';
import { MangaSimplified } from '../../entities';
import { SwaggerExamples } from '../../../utils';
import { DefaultHttpResponse } from '../common';

class GetMangasResponse {
  @ApiProperty({
    type: [MangaSimplified],
    example: SwaggerExamples.simplifiedMangasExample,
  })
  mangas: MangaSimplified[];
}

export class GetMangasHttpResponse extends DefaultHttpResponse<GetMangasResponse> {
  @ApiProperty({ example: 'success' })
  status: string;

  @ApiProperty({ type: GetMangasResponse })
  data: GetMangasResponse;

  constructor(status: string, data: GetMangasResponse) {
    super(status, data);
  }
}
