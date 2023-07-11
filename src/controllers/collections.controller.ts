import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
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
import { User } from '../../prisma/prisma/postgres-client';
import { GetUser } from '../decorators';

@ApiTags('collections')
@ApiSecurity('Authorization')
@ApiSecurity('X-API-Key')
@UseGuards(AuthGuard('api-key'), AuthGuard('jwt'))
@Controller('collections')
export class CollectionsController {
  collectionsService: CollectionsUseCase;
  constructor(
    @Inject(CollectionsUseCase) collectionUseCaseService: CollectionsUseCase,
  ) {
    this.collectionsService = collectionUseCaseService;
  }

  @ApiOperation({ summary: 'Get all collections for the user' })
  @ApiResponse({ status: 200, type: GetCollectionsHttpResponse })
  @Get()
  async findCollections(
    @GetUser() user: User,
  ): Promise<GetCollectionsHttpResponse> {
    const data = await this.collectionsService.findCollections(user.id);
    return {
      status: HttpResponseStatus.SUCCESS,
      data: {
        collections: data,
      },
    };
  }

  @ApiOperation({ summary: 'Create a new collection' })
  @ApiResponse({ status: 200, type: CreateCollectionHttpResponse })
  @Post()
  async createCollection(
    @GetUser() user: User,
    @Body() collectionDto: CollectionDto,
  ): Promise<CreateCollectionHttpResponse> {
    const data = await this.collectionsService.createCollection(
      user.id,
      collectionDto,
    );

    return {
      status: HttpResponseStatus.SUCCESS,
      data: { collection: data },
    };
  }
  @ApiOperation({ summary: 'Delete a collection' })
  @ApiResponse({ status: 200, type: DeleteCollectionHttpResponse })
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
  @ApiOperation({ summary: 'Update a collection' })
  @ApiResponse({ status: 200, type: UpdateCollectionHttpResponse })
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
  @ApiOperation({ summary: 'Get all mangas from a collection' })
  @ApiResponse({ status: 200, type: GetMangasFromCollectionHttpResponse })
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
  @ApiOperation({ summary: 'Add a manga to a collection' })
  @ApiResponse({ status: 200, type: AddMangaToCollectionHttpResponse })
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
  @ApiOperation({ summary: 'Delete a manga from a collection' })
  @ApiResponse({ status: 200, type: DeleteMangaFromCollectionHttpResponse })
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
