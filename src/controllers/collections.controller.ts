import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Collection, MangaSimplified } from 'src/core/entities';
import { CollectionsUseCase } from 'src/use-cases/collections';

@ApiTags('collections')
@Controller('collections')
export class CollectionsController {
  collectionsService: CollectionsUseCase;
  constructor(
    @Inject(CollectionsUseCase) collectionUseCaseService: CollectionsUseCase,
  ) {
    this.collectionsService = collectionUseCaseService;
  }

  @Get()
  findCollections(@Body() userId: string): Promise<Collection[]> {
    return this.collectionsService.findCollections(userId);
  }

  @Post()
  saveCollection(userId: string): Promise<Collection> {
    throw new Error('Method not implemented.');
  }

  @Delete(':id')
  deleteCollection(@Param('id') collectionId: string): Promise<Collection> {
    return this.collectionsService.deleteCollection(collectionId);
  }

  @Put(':id')
  updateCollection(
    @Param('id') collectionId: string,
    @Body() collection: Collection,
  ): Promise<Collection> {
    return this.collectionsService.updateCollection(collection);
  }

  @Get(':id')
  findCollectionMangas(@Param('id') collectionId: string) {
    return this.collectionsService.findCollectionMangas(collectionId);
  }

  // TODO: Add manga info as an argument
  @Post(':id/mangas/:mangaId')
  addMangaToCollection(collectionId: string): Promise<MangaSimplified> {
    throw new Error('Method not implemented.');
  }

  // TODO: Add manga ID as an argument
  @Delete(':id/mangas/:mangaId')
  deleteMangaFromCollection(
    @Param('id') collectionId: string,
    @Body() { mangaId }: { mangaId: string },
  ) {
    return this.collectionsService.deleteMangaFromCollection(
      collectionId,
      mangaId,
    );
  }
}
