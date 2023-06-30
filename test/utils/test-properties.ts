import { AddMangaCollectionDto } from '../../src/core/dtos';
import { CollectionManga } from '../../src/core/entities';

export class TestProperties {
  email = 'vlad@gmail.com';
  password = '123';
  nickname = 'vlad';
  newPassword = '1234';
  profilePic = 'testprofilepic.png';
  increaseScoreValue = 1;
  defaultTestUser = {
    email: 'defaulttestuser@test.com',
    nickname: 'defaultTestUser',
    password: 'testPassword',
  };
  defaultCollection = {
    name: 'Mangás de ação',
    description: 'Uma coleção para mangás de ação',
  };
  manga: CollectionManga = {
    id: '6480bb0edf1d440353f3fcdd',
    name: 'Boshoku No Berserk (Berserk Of Gluttony)',
    cover:
      'https://img.novelcool.com/logo/202206/74/Boshoku_No_Berserk_Berserk_Of_Gluttony1942.jpg',
    synopsis:
      'Neste mundo, existem dois tipos de pessoas. Aqueles que têm poderosas "habilidades" e aqueles que não. As pessoas nascidas com habilidades poderosas exterminam monstros para subirem de nível e se tornarem bem-sucedidas, enquanto as pessoas sem eles, tornam-se fracassos, que são tratados com dureza pela sociedade. Fate é um cara que trabalha como um porteiro, e cuja única habilidade é a gula, uma habilidade que o faz comer almas.',
  };
  addMangaToCollectionDto: AddMangaCollectionDto = {
    mangaId: this.manga.id,
    mangaName: this.manga.name,
    mangaCover: this.manga.cover,
    mangaSynopsis: this.manga.synopsis,
    collectionId: '',
  };
}
