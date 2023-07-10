import * as pactum from 'pactum';
import { User } from '../prisma/prisma/postgres-client';
import { IncreaseScoreDto } from '../src/core/dtos';
import { TestProperties, TestSetup } from './utils';

const testSetup = new TestSetup();
const testProperties = new TestProperties();

let scoreBasePath: string;
let defaultTestUser: User;
beforeAll(async () => {
  await testSetup.setup({ shouldCreateDefaults: true });
  ({ defaultTestUser } = testSetup.getServices());
  scoreBasePath = `/${defaultTestUser.id}/score`;
});

afterAll(async () => {
  await testSetup.teardown();
});

describe('Score', () => {
  it('should get score', async () => {
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

describe('Score Error Handling', () => {
  const nonExistentUserScoreBasePath = `/score/nonExistentUser`;

  it('should not get score for non-existent user', async () => {
    return pactum.spec().get(nonExistentUserScoreBasePath).expectStatus(404);
  });

  it('should not update score for non-existent user', () => {
    const updateScoreDto: IncreaseScoreDto = {
      increase: testProperties.increaseScoreValue,
    };

    return pactum
      .spec()
      .put(nonExistentUserScoreBasePath)
      .withBody(updateScoreDto)
      .expectStatus(404);
  });

  it('should not update score with invalid data', () => {
    const invalidUpdateScoreDto: IncreaseScoreDto = {
      increase: -1,
    };

    return pactum
      .spec()
      .put(scoreBasePath)
      .withBody(invalidUpdateScoreDto)
      .expectStatus(400);
  });
});
