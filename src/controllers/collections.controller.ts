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
import { HttpResponseStatus } from '../core/enums';
import {
  AddMangaToCollectionHttpResponse,
  CreateCollectionHttpResponse,
  DeleteCollectionHttpResponse,
  DeleteMangaFromCollectionHttpResponse,
  GetCollectionsHttpResponse,
  GetMangasFromCollectionHttpResponse,
  UpdateCollectionHttpResponse,
} from '../core/responses';
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
  async findCollections(
    @Param('id') userId: string,
  ): Promise<GetCollectionsHttpResponse> {
    const data = await this.collectionsService.findCollections(userId);
    return {
      status: HttpResponseStatus.SUCCESS,
      data: {
        collections: data,
      },
    };
  }

  @Post()
  async createCollection(
    @Param('id') userId: string,
    @Body() collectionDto: CollectionDto,
  ): Promise<CreateCollectionHttpResponse> {
    const data = await this.collectionsService.createCollection(
      userId,
      collectionDto,
    );

    return {
      status: HttpResponseStatus.SUCCESS,
      data: { collection: data },
    };
  }

  @Delete()
  async deleteCollection(
    @Body() deleteCollectionDto: CollectionIdDto,
  ): Promise<DeleteCollectionHttpResponse> {
    await this.collectionsService.deleteCollection(deleteCollectionDto.id);
    return {
      status: HttpResponseStatus.SUCCESS,
      message: 'Collection deleted successfully',
    };
  }

  @Put()
  async updateCollection(
    @Body() collection: CollectionDto,
  ): Promise<UpdateCollectionHttpResponse> {
    const data = await this.collectionsService.updateCollection(collection);
    return {
      status: HttpResponseStatus.SUCCESS,
      data: { collection: data },
    };
  }

  @Get('mangas')
  async findCollectionMangas(
    @Body() collectionIdDto: CollectionIdDto,
  ): Promise<GetMangasFromCollectionHttpResponse> {
    const data = await this.collectionsService.findCollectionMangas(
      collectionIdDto.id,
    );
    return {
      status: HttpResponseStatus.SUCCESS,
      data: {
        mangas: data,
      },
    };
  }

  @Post('mangas')
  async addMangaToCollection(
    @Body()
    {
      collectionId,
      mangaCover,
      mangaId,
      mangaName,
      mangaSynopsis,
    }: AddMangaCollectionDto,
  ): Promise<AddMangaToCollectionHttpResponse> {
    const data = await this.collectionsService.addMangaToCollection(
      collectionId,
      {
        cover: mangaCover,
        name: mangaName,
        synopsis: mangaSynopsis,
        id: mangaId,
      },
    );
    return {
      status: HttpResponseStatus.SUCCESS,
      data: { manga: data.manga, collection: data.collection },
    };
  }

  @Delete('mangas')
  async deleteMangaFromCollection(
    @Body() { collectionId, mangaId }: DeleteMangaCollectionDto,
  ): Promise<DeleteMangaFromCollectionHttpResponse> {
    await this.collectionsService.deleteMangaFromCollection(
      collectionId,
      mangaId,
    );
    return {
      status: HttpResponseStatus.SUCCESS,
      message: 'Manga deleted from collection successfully',
    };
  }
}
