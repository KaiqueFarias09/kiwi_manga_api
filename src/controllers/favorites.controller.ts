import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { CollectionMangaDto } from '../core/dtos';
import { HttpResponseStatus } from '../core/enums';
import {
  AddFavoriteHttpResponse,
  DeleteFavoriteHttpResponse,
  GetFavoritesHttpResponse,
} from '../core/responses';
import { FavoritesUseCase } from '../use-cases';
import { GetUser } from '../decorators';
import { User } from '../../prisma/prisma/postgres-client';

@ApiTags('favorites')
@ApiSecurity('Authorization')
@ApiSecurity('X-API-Key')
@UseGuards(AuthGuard('api-key'), AuthGuard('jwt'))
@Controller('favorites')
export class FavoritesController {
  favoritesService: FavoritesUseCase;
  constructor(
    @Inject(FavoritesUseCase) favoritesUseCaseService: FavoritesUseCase,
  ) {
    this.favoritesService = favoritesUseCaseService;
  }

  @ApiOperation({
    summary: 'Get all favorites manga for the authenticated user',
  })
  @ApiResponse({ status: 200, type: GetFavoritesHttpResponse })
  @Get()
  async getFavorites(@GetUser() user: User): Promise<GetFavoritesHttpResponse> {
    const data = await this.favoritesService.getFavorites(user.id);
    return {
      status: HttpResponseStatus.SUCCESS,
      data: { mangas: data },
    };
  }
  @ApiOperation({
    summary: 'Add a manga to the favorites of the authenticated user',
  })
  @ApiResponse({ status: 200, type: AddFavoriteHttpResponse })
  @Post()
  async addFavorite(
    @GetUser() user: User,
    @Body() manga: CollectionMangaDto,
  ): Promise<AddFavoriteHttpResponse> {
    const data = await this.favoritesService.addFavorite(manga, user.id);
    return {
      status: HttpResponseStatus.SUCCESS,
      data: { manga: data },
    };
  }
  @ApiOperation({
    summary: 'Remove a manga from the favorites of the authenticated user',
  })
  @ApiResponse({ status: 200, type: DeleteFavoriteHttpResponse })
  @Delete()
  async removeFavorite(
    @GetUser() user: User,
    @Body() manga: CollectionMangaDto,
  ): Promise<DeleteFavoriteHttpResponse> {
    await this.favoritesService.removeFavorite(manga, user.id);
    return {
      status: HttpResponseStatus.SUCCESS,
      message: 'Manga removed from favorites',
    };
  }
}
