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
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
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

  @Get()
  getFavorites(@Param('id') userId: string) {
    return this.favoritesService.getFavorites(userId);
  }

  @Post()
  addFavorite(@Param('id') userId: string, @Body() manga: CollectionMangaDto) {
    return this.favoritesService.addFavorite(manga, userId);
  }

  @Delete()
  removeFavorite(
    @Param('id') userId: string,
    @Body() manga: CollectionMangaDto,
  ) {
    return this.favoritesService.removeFavorite(manga, userId);
  }
}
