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
import { HttpResponseStatus } from '../core/enums';
import {
  AddFavoriteHttpResponse,
  DeleteFavoriteHttpResponse,
  GetFavoritesHttpResponse,
} from '../core/responses';
import { CollectionMangaDto } from '../core/dtos';
import { FavoritesUseCase } from '../use-cases';

@ApiTags('favorites')
@ApiSecurity('Authorization')
@UseGuards(AuthGuard('api-key'))
@Controller(':id/favorites')
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
    @Param('id') userId: string,
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
    @Param('id') userId: string,
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
    @Param('id') userId: string,
    @Body() manga: CollectionMangaDto,
  ): Promise<DeleteFavoriteHttpResponse> {
    await this.favoritesService.removeFavorite(manga, userId);
    return {
      status: HttpResponseStatus.SUCCESS,
      message: 'Manga removed from favorites',
    };
  }
}
