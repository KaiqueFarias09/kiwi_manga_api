import { ApiProperty } from '@nestjs/swagger';
import { MangaEntity } from '../../entities';
import { DefaultHttpResponse } from '../common';
import { SwaggerExamples } from '../../../utils';

class GetMangaByIdResponse {
  @ApiProperty({
    type: MangaEntity,
    example: SwaggerExamples.mangaEntityExample,
  })
  manga: MangaEntity;
}

export class GetMangaByIdHttpResponse extends DefaultHttpResponse<GetMangaByIdResponse> {
  @ApiProperty({ example: 'success' })
  status: string;

  @ApiProperty({ type: GetMangaByIdResponse })
  data: GetMangaByIdResponse;

  constructor(status: string, data: GetMangaByIdResponse) {
    super(status, data);
  }
}
