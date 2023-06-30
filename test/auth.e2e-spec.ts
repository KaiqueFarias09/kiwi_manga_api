import * as pactum from 'pactum';
import { SigninDto, SignupDto } from '../src/core/dtos';
import { PostgresService } from '../src/frameworks/postgres-prisma/postgres-prisma.service';
import { TestSetup } from './utils/test-organizer';
import { TestProperties } from './utils/test-properties';

const testSetup = new TestSetup();
const testProperties = new TestProperties();
let postgresService: PostgresService;

beforeAll(async () => {
  await testSetup.setup();
  ({ postgresService } = testSetup.getServices());
});

afterAll(async () => {
  await postgresService.user.delete({
    where: {
      email: testProperties.email,
    },
  });
  await testSetup.teardown();
});

pactum.request.setDefaultTimeout(10000);
describe('Auth', () => {
  const authDto: SignupDto = {
    email: testProperties.email,
    password: testProperties.password,
    nickname: testProperties.nickname,
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
      email: testProperties.email,
      password: testProperties.password,
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
      return pactum
        .spec()
        .post('/auth/signin')
        .withBody(signinDto)
        .expectStatus(200)
        .stores('userAt', 'access_token');
    });
  });
});

describe('Auth Error Handling', () => {
  const existingUserSignupDto: SignupDto = {
    email: testProperties.email,
    password: testProperties.password,
    nickname: testProperties.nickname,
  };
  const incorrectPasswordSigninDto: SigninDto = {
    email: testProperties.email,
    password: 'incorrectPassword',
  };
  const nonExistentUserSigninDto: SigninDto = {
    email: 'nonexistentuser@example.com',
    password: testProperties.password,
  };

  describe('Signup', () => {
    it("should not sign up with an email that's already in use", () => {
      return pactum
        .spec()
        .post('/auth/signup')
        .withBody(existingUserSignupDto)
        .expectStatus(409);
    });
  });

  describe('Signin', () => {
    it('should not sign in with an incorrect password', () => {
      return pactum
        .spec()
        .post('/auth/signin')
        .withBody(incorrectPasswordSigninDto)
        .expectStatus(401);
    });

    it("should not sign in with an email that doesn't exist", () => {
      return pactum
        .spec()
        .post('/auth/signin')
        .withBody(nonExistentUserSigninDto)
        .expectStatus(401);
    });
  });
});
