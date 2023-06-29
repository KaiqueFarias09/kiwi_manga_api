import * as pactum from 'pactum';
import { User } from '../prisma/prisma/postgres-client';
import { PostgresService } from '../src/frameworks/postgres-prisma/postgres-prisma.service';
import { TestProperties, TestSetup } from './utils';

const testSetup = new TestSetup();
const testProperties = new TestProperties();

let postgresService: PostgresService;
let defaultTestUser: User;
beforeAll(async () => {
  await testSetup.setup();
  ({ defaultTestUser, postgresService } = testSetup.getServices());
});

afterAll(async () => {
  await postgresService.manga.delete({
    where: {
      id: testProperties.manga.id,
    },
  });
  await testSetup.teardown();
});

describe('Favorites', () => {
  let favoritesBasePath: string;

  it('should add favorite', async () => {
    favoritesBasePath = `/${defaultTestUser.id}/favorites`;

    return pactum
      .spec()
      .post(favoritesBasePath)
      .withBody(testProperties.manga)
      .expectStatus(201);
  });

  it('should get favorites', async () => {
    return pactum.spec().get(favoritesBasePath).expectStatus(200);
  });

  it('should delete favorite', () => {
    return pactum
      .spec()
      .delete(favoritesBasePath)
      .withBody(testProperties.manga)
      .expectStatus(200);
  });
});
