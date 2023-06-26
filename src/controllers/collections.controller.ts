import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import {
  AddMangaCollectionDto,
  CollectionDto,
  CollectionIdDto,
  DeleteMangaCollectionDto,
} from '../core/dtos';
import { Collection } from '../core/entities';
import { CollectionsUseCase } from '../use-cases';

@ApiTags('collections')
@ApiSecurity('Authorization')
@UseGuards(AuthGuard('api-key'))
@Controller(':id/collections')
export class CollectionsController {
  collectionsService: CollectionsUseCase;
  constructor(
    @Inject(CollectionsUseCase) collectionUseCaseService: CollectionsUseCase,
  ) {
    this.collectionsService = collectionUseCaseService;
  }

  @Get()
  findCollections(@Param('id') userId: string): Promise<Collection[]> {
    return this.collectionsService.findCollections(userId);
  }

  @Post()
  saveCollection(
    @Param('id') userId: string,
    @Body() collectionDto: CollectionDto,
  ): Promise<Collection> {
    return this.collectionsService.saveCollection(userId, collectionDto);
  }

  @Delete()
  deleteCollection(@Body() deleteCollectionDto: CollectionIdDto) {
    return this.collectionsService.deleteCollection(deleteCollectionDto.id);
  }

  @Put()
  updateCollection(@Body() collection: CollectionDto): Promise<Collection> {
    return this.collectionsService.updateCollection(collection);
  }

  @Get('mangas')
  findCollectionMangas(@Body() collectionIdDto: CollectionIdDto) {
    return this.collectionsService.findCollectionMangas(collectionIdDto.id);
  }

  @Post('mangas')
  addMangaToCollection(
    @Body()
    {
      collectionId,
      mangaCover,
      mangaId,
      mangaName,
      mangaSynopsis,
    }: AddMangaCollectionDto,
  ) {
    return this.collectionsService.addMangaToCollection(collectionId, {
      cover: mangaCover,
      name: mangaName,
      synopsis: mangaSynopsis,
      id: mangaId,
    });
  }

  @Delete('mangas')
  deleteMangaFromCollection(
    @Body() { collectionId, mangaId }: DeleteMangaCollectionDto,
  ) {
    return this.collectionsService.deleteMangaFromCollection(
      collectionId,
      mangaId,
    );
  }
}
