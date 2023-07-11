import * as pactum from 'pactum';
import { PostgresService } from '../src/frameworks/postgres-prisma/postgres-prisma.service';
import { TestProperties, TestSetup } from './utils';

const testSetup = new TestSetup();
const testProperties = new TestProperties();

let postgresService: PostgresService;
let favoritesBasePath: string;
beforeAll(async () => {
  await testSetup.setup({ shouldCreateDefaults: true });
  ({ postgresService } = testSetup.getServices());
  favoritesBasePath = `/favorites`;
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
  it('should add favorite', async () => {
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

describe('Favorites Error Handling', () => {
  const nonExistentUserBasePath = `/nonexistentuser/favorites`;

  it('should not add favorite for non-existent user', async () => {
    return pactum
      .spec()
      .post(nonExistentUserBasePath)
      .withBody(testProperties.manga)
      .expectStatus(404);
  });

  it('should not get favorites for non-existent user', async () => {
    return pactum.spec().get(nonExistentUserBasePath).expectStatus(404);
  });

  it('should not delete favorite for non-existent user', () => {
    return pactum
      .spec()
      .delete(favoritesBasePath)
      .withBody(testProperties.manga)
      .withHeaders({
        Authorization: 'Bearer nonexistentuserToken',
      })
      .expectStatus(401);
  });

  it('should not add duplicate favorite', async () => {
    await pactum
      .spec()
      .post(favoritesBasePath)
      .withBody(testProperties.manga)
      .expectStatus(201);

    return pactum
      .spec()
      .post(favoritesBasePath)
      .withBody(testProperties.manga)
      .expectStatus(400);
  });

  it('should not delete non-existent favorite', async () => {
    await pactum
      .spec()
      .delete(favoritesBasePath)
      .withBody(testProperties.manga)
      .expectStatus(200);

    return pactum
      .spec()
      .delete(favoritesBasePath)
      .withBody(testProperties.manga)
      .expectStatus(400);
  });
});
