import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CollectionManga } from 'src/core/entities';
import { FavoritesUseCase } from 'src/use-cases';

@ApiTags('favorites')
@Controller()
export class FavoritesController {
  favoritesService: FavoritesUseCase;
  constructor(
    @Inject(FavoritesUseCase) favoritesUseCaseService: FavoritesUseCase,
  ) {
    this.favoritesService = favoritesUseCaseService;
  }

  @Get(':id/favorites')
  getFavorites(@Param('id') userId: string) {
    return this.favoritesService.getFavorites(userId);
  }

  @Post(':id/favorites')
  addFavorite(@Param('id') userId: string, @Body() manga: CollectionManga) {
    return this.favoritesService.addFavorite(manga, userId);
  }

  @Delete(':id/favorites')
  removeFavorite(@Param('id') userId: string, @Body() manga: CollectionManga) {
    return this.favoritesService.removeFavorite(manga, userId);
  }
}
