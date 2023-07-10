import * as pactum from 'pactum';
import { User } from '../prisma/prisma/postgres-client';
import { UpdateProfilePicDto } from '../src/core/dtos';
import { TestProperties, TestSetup } from './utils';

const testSetup = new TestSetup();
const testProperties = new TestProperties();

let baseProfilePicPath: string;
let defaultTestUser: User;
beforeAll(async () => {
  await testSetup.setup({ shouldCreateDefaults: true });
  ({ defaultTestUser } = testSetup.getServices());
  baseProfilePicPath = `/${defaultTestUser.id}/profile-pic`;
});

afterAll(async () => {
  await testSetup.teardown();
});

describe('ProfilePic', () => {
  it('should update profile pic', async () => {
    const updateProfilePicDto: UpdateProfilePicDto = {
      profilePic: testProperties.profilePic,
    };
    return pactum
      .spec()
      .put(baseProfilePicPath)
      .withBody(updateProfilePicDto)
      .expectStatus(200);
  });

  it('should get profile pic', () => {
    return pactum.spec().get(baseProfilePicPath).expectStatus(200);
  });
});

describe('ProfilePic Error Handling', () => {
  const nonExistentUserProfilePicBasePath = `/profile-pic/nonexistentuser`;

  it('should not update profile pic for non-existent user', async () => {
    const updateProfilePicDto: UpdateProfilePicDto = {
      profilePic: testProperties.profilePic,
    };
    return pactum
      .spec()
      .put(nonExistentUserProfilePicBasePath)
      .withBody(updateProfilePicDto)
      .expectStatus(404);
  });

  it('should not get profile pic for non-existent user', () => {
    return pactum
      .spec()
      .get(nonExistentUserProfilePicBasePath)
      .expectStatus(404);
  });

  it('should not update profile pic with invalid data', async () => {
    return pactum
      .spec()
      .put(baseProfilePicPath)
      .withBody({
        profilePic: 12312321,
      })
      .expectStatus(400);
  });
});
