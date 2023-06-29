import * as pactum from 'pactum';
import { User } from '../prisma/prisma/postgres-client';
import { UpdateProfilePicDto } from '../src/core/dtos';
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

describe('ProfilePic', () => {
  let baseProfilePicPath: string;
  it('should update profile pic', async () => {
    baseProfilePicPath = `/profile-pic/${defaultTestUser.id}`;
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
