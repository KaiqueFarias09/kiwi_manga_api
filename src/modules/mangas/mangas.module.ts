import { Module } from '@nestjs/common';
import { MangasController } from './controllers/mangas.controller';
import {  MangasService } from './services/mangas.service';

@Module({
  controllers: [MangasController],
  providers: [MangasService],
})
export class MangasModule {}
