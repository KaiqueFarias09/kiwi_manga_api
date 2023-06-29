import { describe, it } from '@jest/globals';
import * as pactum from 'pactum';
import { User } from '../prisma/prisma/postgres-client';
import { TestSetup } from './utils/test-organizer';
import { TestProperties } from './utils/test-properties';

const testSetup = new TestSetup();
const testProperties = new TestProperties();

let defaultTestUser: User;
beforeAll(async () => {
  await testSetup.setup();
  ({ defaultTestUser } = testSetup.getServices());
});

afterAll(async () => {
  await testSetup.teardown(true);
});

describe('Users', () => {
  let usersBasePath: string;

  describe('Password', () => {
    it('should change password', async () => {
      usersBasePath = `/users/${defaultTestUser.id}`;
      const changePasswordDto = {
        password: testProperties.defaultTestUser.password,
        newPassword: testProperties.newPassword,
      };

      return pactum
        .spec()
        .patch(`${usersBasePath}/password`)
        .withBody(changePasswordDto)
        .expectStatus(200);
    });
  });

  describe('Nickname', () => {
    it('should change nickname', () => {
      const changeNicknameDto = {
        newNickname: 'vlad',
        password: testProperties.newPassword,
      };

      return pactum
        .spec()
        .patch(`${usersBasePath}/nickname`)
        .withBody(changeNicknameDto)
        .expectStatus(200);
    });
  });

  describe('Email', () => {
    it('should change email', () => {
      const changeEmailDto = {
        newEmail: `2${defaultTestUser.email}}`,
        password: testProperties.newPassword,
      };

      return pactum
        .spec()
        .patch(`${usersBasePath}/email`)
        .withBody(changeEmailDto)
        .expectStatus(200);
    });
  });

  describe('Delete', () => {
    it('should delete user', () => {
      return pactum
        .spec()
        .delete(usersBasePath)
        .withBody({
          password: testProperties.newPassword,
        })
        .expectStatus(200);
    });
  });
});
