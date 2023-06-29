import * as pactum from 'pactum';
import { Collection, User } from '../prisma/prisma/postgres-client';
import { CollectionDto } from '../src/core/dtos';
import { PostgresService } from '../src/frameworks/postgres-prisma/postgres-prisma.service';
import { TestProperties, TestSetup } from './utils';

const testSetup = new TestSetup();
const testProperties = new TestProperties();

let defaultTestUser: User;
let postgresService: PostgresService;
beforeAll(async () => {
  await testSetup.setup();
  ({ postgresService, defaultTestUser } = testSetup.getServices());
});

afterAll(async () => {
  await testSetup.teardown();
});

describe('Collections', () => {
  let collectionsBasePath: string;
  let collectionsMangasBasePath: string;
  let collection: Collection;

  const collectionDto: CollectionDto = {
    name: 'Mangás de ação',
    description: 'Uma coleção para mangás de ação',
  };

  it('should add collection', async () => {
    collectionsBasePath = `/${defaultTestUser.id}/collections`;
    collectionsMangasBasePath = `${collectionsBasePath}/mangas`;

    return pactum
      .spec()
      .post(collectionsBasePath)
      .withBody(collectionDto)
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
