import * as pactum from 'pactum';
import { IncreaseScoreDto } from '../src/core/dtos';
import { TestProperties, TestSetup } from './utils';

const testSetup = new TestSetup();
const testProperties = new TestProperties();

let scoreBasePath: string;
beforeAll(async () => {
  await testSetup.setup({ shouldCreateDefaults: true });
  scoreBasePath = `/score`;
});

afterAll(async () => {
  await testSetup.teardown();
});

describe('Score', () => {
  it('should get score', async () => {
    return pactum.spec().get(`${scoreBasePath}/podium`).expectStatus(200);
  });

  it('should update score', () => {
    const updateScoreDto: IncreaseScoreDto = {
      pointsToAdd: testProperties.increaseScoreValue,
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
      pointsToAdd: testProperties.increaseScoreValue,
    };

    return pactum
      .spec()
      .put(nonExistentUserScoreBasePath)
      .withBody(updateScoreDto)
      .expectStatus(404);
  });

  it('should not update score with invalid data', () => {
    const invalidUpdateScoreDto: IncreaseScoreDto = {
      pointsToAdd: -1,
    };

    return pactum
      .spec()
      .put(scoreBasePath)
      .withBody(invalidUpdateScoreDto)
      .expectStatus(400);
  });
});
