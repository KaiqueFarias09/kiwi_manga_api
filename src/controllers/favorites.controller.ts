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
import { CollectionMangaDto } from 'src/core/dtos';
import { FavoritesUseCase } from 'src/use-cases';

@ApiTags('favorites')
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
