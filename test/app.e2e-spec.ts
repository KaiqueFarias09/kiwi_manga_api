import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import helmet from 'helmet';
import * as pactum from 'pactum';
import { User } from '../prisma/prisma/postgres-client';
import { AppModule } from '../src/app.module';
import {
  IncreaseScoreDto,
  SigninDto,
  SignupDto,
  UpdateProfilePicDto,
} from '../src/core/dtos';
import { MongoService } from '../src/frameworks/mongo-prisma/mongo-prisma.service';
import { PostgresService } from '../src/frameworks/postgres-prisma/postgres-prisma.service';

describe('App e2e', () => {
  let app: INestApplication;
  let postgresService: PostgresService;
  let mongoService: MongoService;
  let configService: ConfigService;

  let user: User;
  const userEmail = 'vlad@gmail.com';
  const userPassword = '123';
  const userNickname = 'vlad';

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.use(helmet());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3333);

    postgresService = app.get(PostgresService);
    mongoService = app.get(MongoService);
    configService = app.get(ConfigService);

    pactum.request.setBaseUrl('http://localhost:3333');
    pactum.request.setDefaultHeaders({
      Authorization: configService.get<string>('ADMIN_TOKEN'),
    });
  });

  afterAll(() => {
    app.close();
  });

  describe('Health', () => {
    describe('Get health', () => {
      it('should return health', () => {
        return pactum.spec().get('/health').expectStatus(200);
      });
    });
  });

  describe('Auth', () => {
    const authDto: SignupDto = {
      email: userEmail,
      password: userPassword,
      nickname: userNickname,
    };
    describe('Signup', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: authDto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: authDto.email,
          })
          .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      });
      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(authDto)
          .expectStatus(201);
      });
    });

    describe('Signin', () => {
      const signinDto: SigninDto = {
        email: userEmail,
        password: userPassword,
      };

      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: signinDto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: signinDto.email,
          })
          .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return pactum.spec().post('/auth/signin').expectStatus(400);
      });
      it('should signin', async () => {
        user = await postgresService.user.findUnique({
          where: {
            email: userEmail,
          },
        });
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(signinDto)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });
    });
  });

  describe('ProfilePic', () => {
    let baseProfilePicPath: string;
    it('should update profile pic', async () => {
      user = await postgresService.user.findUnique({
        where: {
          email: userEmail,
        },
      });
      baseProfilePicPath = `/profile-pic/${user.id}`;
      const updateProfilePicDto: UpdateProfilePicDto = {
        profilePic: 'profilePic',
      };
      return pactum
        .spec()
        .put(baseProfilePicPath)
        .withBody(updateProfilePicDto)
        .expectStatus(200);
    });

    it('should get profile pic', () => {
      return pactum.spec().get(baseProfilePicPath).expectStatus(200);
    });
  });

  describe('Score', () => {
    let scoreBasePath: string;

    it('should get score', async () => {
      user = await postgresService.user.findUnique({
        where: {
          email: userEmail,
        },
      });
      scoreBasePath = `/score/${user.id}`;
      return pactum.spec().get(scoreBasePath).expectStatus(200);
    });

    it('should update score', () => {
      const updateScoreDto: IncreaseScoreDto = {
        increase: 1,
      };

      return pactum
        .spec()
        .put(scoreBasePath)
        .withBody(updateScoreDto)
        .expectStatus(200);
    });
  });

  // describe('Favorites', () => {
  //   let favoritesBasePath: string;
  //   let manga: Manga;

  //   it('should get favorites', async () => {
  //     user = await postgresService.user.findUnique({
  //       where: {
  //         email: userEmail,
  //       },
  //     });
  //     manga = await postgresService.manga.findFirst();
  //     favoritesBasePath = `/favorites/${user.id}`;
  //     return pactum.spec().get(favoritesBasePath).expectStatus(200);
  //   });

  //   it('should add favorite', () => {
  //     return pactum
  //       .spec()
  //       .post(favoritesBasePath)
  //       .withBody({
  //         mangaId: manga.id,
  //       })
  //       .expectStatus(201);
  //   });

  //   it('should delete favorite', () => {
  //     return pactum
  //       .spec()
  //       .delete(favoritesBasePath)
  //       .withBody({
  //         mangaId: manga.id,
  //       })
  //       .expectStatus(200);
  //   });
  // });

  // describe('Collections', () => {
  //   let collectionsBasePath: string;
  //   let manga: Manga;

  //   it('should get collections', async () => {
  //     user = await postgresService.user.findUnique({
  //       where: {
  //         email: userEmail,
  //       },
  //     });
  //     manga = await postgresService.manga.findFirst();
  //     collectionsBasePath = `/collections/${user.id}`;
  //     return pactum.spec().get(collectionsBasePath).expectStatus(200);
  //   });

  //   it('should add collection', () => {
  //     return pactum
  //       .spec()
  //       .post(collectionsBasePath)
  //       .withBody({
  //         mangaId: manga.id,
  //       })
  //       .expectStatus(201);
  //   });

  //   it('should delete collection', () => {
  //     return pactum
  //       .spec()
  //       .delete(collectionsBasePath)
  //       .withBody({
  //         mangaId: manga.id,
  //       })
  //       .expectStatus(200);
  //   });
  // });

  describe('Mangas', () => {
    const mangasBasePath = '/mangas';
    describe('Random', () => {
      it('should get random manga', () => {
        return pactum.spec().get(`${mangasBasePath}/random}`).expectStatus(200);
      });
    });

    describe('List', () => {
      it('should get manga list with 1 keyword', () => {
        return pactum.spec().get(mangasBasePath).withQueryParams({
          keywords: 'Berserk',
        });
      });

      it('should get manga list with more than 1 keyword', () => {
        return pactum.spec().get(mangasBasePath).withQueryParams({
          keywords: 'Berserk&Vagabond',
        });
      });
    });

    describe('Details', () => {
      it('should get manga details', async () => {
        const count = await mongoService.manga.count();
        const skip = Math.floor(Math.random() * count);

        const randomManga = await mongoService.manga.findFirst({
          skip,
          where: { hasCover: true },
        });
        return pactum.spec().get(`/mangas/${randomManga.id}`).expectStatus(200);
      });
    });
  });

  describe('Users', () => {
    let usersBasePath: string;
    const newPassword = '1234';

    describe('Password', () => {
      it('should change password', async () => {
        usersBasePath = `/users/${user.id}`;
        const changePasswordDto = {
          password: userPassword,
          newPassword: newPassword,
        };

        return pactum
          .spec()
          .patch(`${usersBasePath}/password`)
          .withBody(changePasswordDto)
          .expectStatus(200);
      });
    });

    describe('Nickname', () => {
      it('should change nickname', () => {
        const changeNicknameDto = {
          newNickname: 'vlad',
          password: newPassword,
        };

        return pactum
          .spec()
          .patch(`${usersBasePath}/nickname`)
          .withBody(changeNicknameDto)
          .expectStatus(200);
      });
    });

    describe('Email', () => {
      it('should change email', () => {
        const changeEmailDto = {
          newEmail: 'vlad2@gmail.com',
          password: newPassword,
        };

        return pactum
          .spec()
          .patch(`${usersBasePath}/email`)
          .withBody(changeEmailDto)
          .expectStatus(200);
      });
    });

    describe('Delete', () => {
      it('should delete user', () => {
        return pactum
          .spec()
          .delete(usersBasePath)
          .withBody({
            password: newPassword,
          })
          .expectStatus(200);
      });
    });
  });
});
