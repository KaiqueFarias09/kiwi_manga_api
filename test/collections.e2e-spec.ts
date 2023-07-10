import * as pactum from 'pactum';
import { Collection, User } from '../prisma/prisma/postgres-client';
import { PostgresService } from '../src/frameworks/postgres-prisma/postgres-prisma.service';
import { TestProperties, TestSetup } from './utils';

const testSetup = new TestSetup();
const testProperties = new TestProperties();

let defaultTestUser: User;
let postgresService: PostgresService;
beforeAll(async () => {
  await testSetup.setup({ shouldCreateDefaults: true });
  ({ postgresService, defaultTestUser } = testSetup.getServices());
});

afterAll(async () => {
  await testSetup.teardown();
});

describe('Collections', () => {
  let collectionsBasePath: string;
  let collectionsMangasBasePath: string;
  let collection: Collection;

  it('should add collection', async () => {
    collectionsBasePath = `/${defaultTestUser.id}/collections`;
    collectionsMangasBasePath = `${collectionsBasePath}/mangas`;

    return pactum
      .spec()
      .post(collectionsBasePath)
      .withBody(testProperties.defaultCollection)
      .expectStatus(201);
  });

  it('should get collections', () => {
    return pactum.spec().get(collectionsBasePath).expectStatus(200);
  });

  it('should update collection', async () => {
    const dbCollections = await postgresService.collection.findMany({
      where: {
        userId: defaultTestUser.id,
      },
    });
    collection = dbCollections[0];

    return pactum
      .spec()
      .put(collectionsBasePath)
      .withBody({
        id: collection.id,
        name: 'Mangás de ação',
        description:
          'Uma coleção para mangás de terror que também têm uma ação',
      })
      .expectStatus(200);
  });

  it('should add manga to collection', () => {
    testProperties.addMangaToCollectionDto.collectionId = collection.id;

    return pactum
      .spec()
      .post(collectionsMangasBasePath)
      .withBody(testProperties.addMangaToCollectionDto)
      .expectStatus(201);
  });

  it('should get all mangas from collection', () => {
    return pactum
      .spec()
      .get(collectionsMangasBasePath)
      .withBody({
        id: collection.id,
      })
      .expectStatus(200);
  });

  it('should delete manga from collection', () => {
    return pactum
      .spec()
      .delete(collectionsMangasBasePath)
      .withBody({
        collectionId: collection.id,
        mangaId: '6480bb0edf1d440353f3fcdd',
      })
      .expectStatus(200);
  });

  it('should delete collection', async () => {
    return pactum
      .spec()
      .delete(collectionsBasePath)
      .withBody({
        id: collection.id,
      })
      .expectStatus(200);
  });
});

describe('Collections Error Handling', () => {
  const nonExistentUserCollectionsBasePath = `/nonexistentuser/collections`;
  const nonExistentUserCollectionsMangasBasePath = `${nonExistentUserCollectionsBasePath}/mangas`;

  it('should not add collection for non-existent user', async () => {
    return pactum
      .spec()
      .post(nonExistentUserCollectionsBasePath)
      .withBody(testProperties.defaultCollection)
      .expectStatus(404);
  });

  it('should not update non-existent collection', async () => {
    return pactum
      .spec()
      .put(nonExistentUserCollectionsBasePath)
      .withBody({
        id: 'nonexistentcollection',
        name: 'Mangás de ação',
        description:
          'Uma coleção para mangás de terror que também têm uma ação',
      })
      .expectStatus(404);
  });

  it('should not add manga to non-existent collection', () => {
    return pactum
      .spec()
      .post(nonExistentUserCollectionsMangasBasePath)
      .withBody(testProperties.addMangaToCollectionDto)
      .expectStatus(404);
  });

  it('should not get all mangas from non-existent collection', () => {
    return pactum
      .spec()
      .get(nonExistentUserCollectionsMangasBasePath)
      .withBody({
        id: 'nonexistentcollection',
      })
      .expectStatus(404);
  });

  it('should not delete manga from non-existent collection', () => {
    return pactum
      .spec()
      .delete(nonExistentUserCollectionsMangasBasePath)
      .withBody({
        collectionId: 'nonexistentcollection',
        mangaId: '6480bb0edf1d440353f3fcdd',
      })
      .expectStatus(404);
  });

  it('should not delete non-existent collection', async () => {
    return pactum
      .spec()
      .delete(nonExistentUserCollectionsBasePath)
      .withBody({
        id: 'nonexistentcollection',
      })
      .expectStatus(404);
  });
});
