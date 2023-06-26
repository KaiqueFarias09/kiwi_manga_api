import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { PostgresService } from '../src/frameworks/postgres-prisma/postgres-prisma.service';

describe('App e2e', () => {
  let app: INestApplication;
  let postgresService: PostgresService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3333);

    postgresService = app.get(PostgresService);
    await postgresService.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333');
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

  // describe('Auth', () => {
  //   const dto: SignupDto = {
  //     email: 'vlad@gmail.com',
  //     password: '123',
  //     nickname: 'vlad',
  //   };
  //   describe('Signup', () => {
  //     it('should throw if email empty', () => {
  //       return pactum
  //         .spec()
  //         .post('/auth/signup')
  //         .withBody({
  //           password: dto.password,
  //         })
  //         .expectStatus(400);
  //     });
  //     it('should throw if password empty', () => {
  //       return pactum
  //         .spec()
  //         .post('/auth/signup')
  //         .withBody({
  //           email: dto.email,
  //         })
  //         .expectStatus(400);
  //     });
  //     it('should throw if no body provided', () => {
  //       return pactum.spec().post('/auth/signup').expectStatus(400);
  //     });
  //     it('should signup', () => {
  //       return pactum
  //         .spec()
  //         .post('/auth/signup')
  //         .withBody(dto)
  //         .expectStatus(201);
  //     });
  //   });

  // describe('Signin', () => {
  //   it('should throw if email empty', () => {
  //     return pactum
  //       .spec()
  //       .post('/auth/signin')
  //       .withBody({
  //         password: dto.password,
  //       })
  //       .expectStatus(400);
  //   });
  //   it('should throw if password empty', () => {
  //     return pactum
  //       .spec()
  //       .post('/auth/signin')
  //       .withBody({
  //         email: dto.email,
  //       })
  //       .expectStatus(400);
  //   });
  //   it('should throw if no body provided', () => {
  //     return pactum.spec().post('/auth/signin').expectStatus(400);
  //   });
  //   it('should signin', () => {
  //     return pactum
  //       .spec()
  //       .post('/auth/signin')
  //       .withBody(dto)
  //       .expectStatus(200)
  //       .stores('userAt', 'access_token');
  //   });
  // });
  // });
});
