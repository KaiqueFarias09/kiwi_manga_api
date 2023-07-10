import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { CollectionMangaDto } from '../core/dtos';
import { HttpResponseStatus } from '../core/enums';
import {
  AddFavoriteHttpResponse,
  DeleteFavoriteHttpResponse,
  GetFavoritesHttpResponse,
} from '../core/responses';
import { FavoritesUseCase } from '../use-cases';

@ApiTags('favorites')
@ApiSecurity('Authorization')
@ApiSecurity('X-API-Key')
@UseGuards(AuthGuard('api-key'), AuthGuard('jwt'))
@Controller(':userId/favorites')
export class FavoritesController {
  favoritesService: FavoritesUseCase;
  constructor(
    @Inject(FavoritesUseCase) favoritesUseCaseService: FavoritesUseCase,
  ) {
    this.favoritesService = favoritesUseCaseService;
  }

  @ApiResponse({ status: 200, type: GetFavoritesHttpResponse })
  @Get()
  async getFavorites(
    @Param('userId') userId: string,
  ): Promise<GetFavoritesHttpResponse> {
    const data = await this.favoritesService.getFavorites(userId);
    return {
      status: HttpResponseStatus.SUCCESS,
      data: { mangas: data },
    };
  }

  @ApiResponse({ status: 200, type: AddFavoriteHttpResponse })
  @Post()
  async addFavorite(
    @Param('userId') userId: string,
    @Body() manga: CollectionMangaDto,
  ): Promise<AddFavoriteHttpResponse> {
    const data = await this.favoritesService.addFavorite(manga, userId);
    return {
      status: HttpResponseStatus.SUCCESS,
      data: { manga: data },
    };
  }

  @ApiResponse({ status: 200, type: DeleteFavoriteHttpResponse })
  @Delete()
  async removeFavorite(
    @Param('userId') userId: string,
    @Body() manga: CollectionMangaDto,
  ): Promise<DeleteFavoriteHttpResponse> {
    await this.favoritesService.removeFavorite(manga, userId);
    return {
      status: HttpResponseStatus.SUCCESS,
      message: 'Manga removed from favorites',
    };
  }
}
