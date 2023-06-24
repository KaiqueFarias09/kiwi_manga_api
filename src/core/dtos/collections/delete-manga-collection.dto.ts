import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteMangaCollectionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  mangaId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  collectionId: string;
}
