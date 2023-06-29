import * as pactum from 'pactum';
import { MongoService } from 'src/frameworks/mongo-prisma/mongo-prisma.service';
import { TestSetup } from './utils';

pactum.request.setDefaultTimeout(15000);
const testSetup = new TestSetup();

let mongoService: MongoService;
beforeAll(async () => {
  await testSetup.setup();
  ({ mongoService } = testSetup.getServices());
});

afterAll(async () => {
  await testSetup.teardown();
});

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
