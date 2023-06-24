import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddMangaCollectionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  mangaId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  mangaName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  mangaCover: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  mangaSynopsis: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  collectionId: string;
}
