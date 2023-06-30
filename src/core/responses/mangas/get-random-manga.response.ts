import { ApiProperty } from '@nestjs/swagger';
import { MangaEntity } from '../../entities';
import { SwaggerExamples } from '../../../utils';
import { DefaultHttpResponse } from '../common';

class GetRandomMangaResponse {
  @ApiProperty({
    type: MangaEntity,
    example: SwaggerExamples.mangaEntityExample,
  })
  manga: MangaEntity;
}

export class GetRandomMangaHttpResponse extends DefaultHttpResponse<GetRandomMangaResponse> {
  @ApiProperty({ type: GetRandomMangaResponse })
  data: GetRandomMangaResponse;

  @ApiProperty({ example: 'success' })
  status: string;

  constructor(status: string, data: GetRandomMangaResponse) {
    super(status, data);
  }
}
