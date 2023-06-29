import * as pactum from 'pactum';
import { User } from '../prisma/prisma/postgres-client';
import { IncreaseScoreDto } from '../src/core/dtos';
import { TestProperties, TestSetup } from './utils';

const testSetup = new TestSetup();
const testProperties = new TestProperties();

let defaultTestUser: User;
beforeAll(async () => {
  await testSetup.setup();
  ({ defaultTestUser } = testSetup.getServices());
});

afterAll(async () => {
  await testSetup.teardown();
});

describe('Score', () => {
  let scoreBasePath: string;

  it('should get score', async () => {
    scoreBasePath = `/score/${defaultTestUser.id}`;
    return pactum.spec().get(scoreBasePath).expectStatus(200);
  });

  it('should update score', () => {
    const updateScoreDto: IncreaseScoreDto = {
      increase: testProperties.increaseScoreValue,
    };

    return pactum
      .spec()
      .put(scoreBasePath)
      .withBody(updateScoreDto)
      .expectStatus(200);
  });
});
