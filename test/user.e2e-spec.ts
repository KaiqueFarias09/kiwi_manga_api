import { describe, it } from '@jest/globals';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2';
import * as pactum from 'pactum';
import { TestProperties, TestSetup } from './utils';

const testSetup = new TestSetup();
const testProperties = new TestProperties();

let newTestEmail: string;
let newTestPassword: string;
let app: INestApplication;
let configService: ConfigService;
let jwtToken: string;

beforeAll(async () => {
  await testSetup.setup({ shouldCreateDefaults: false });
  ({ app, configService } = testSetup.getServices());
  pactum.request.setBaseUrl(
    `http://localhost:${app.getHttpServer().address().port}/user`,
  );
});

afterAll(async () => {
  await testSetup.teardown(true);
});

describe('Users', () => {
  describe('Password', () => {
    it('should change password', async () => {
      newTestEmail = `${Math.random()}${testProperties.email}`;
      newTestPassword = await argon.hash(testProperties.newPassword);

      jwtToken = await testSetup.signupNewUser({
        email: newTestEmail,
        hashedPassword: newTestPassword,
      });

      const changePasswordDto = {
        password: testProperties.newPassword,
        newPassword: testProperties.newPassword,
      };

      pactum.request.setDefaultHeaders({
        'X-API-Key': configService.get<string>('ADMIN_TOKEN'),
        Authorization: `Bearer ${jwtToken}`,
      });

      return pactum
        .spec()
        .patch(`/password`)
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
        .patch('/nickname')
        .withBody(changeNicknameDto)
        .expectStatus(200);
    });
  });

  describe('Email', () => {
    it('should change email', () => {
      const changeEmailDto = {
        newEmail: `2${newTestEmail}}`,
        password: testProperties.newPassword,
      };

      return pactum
        .spec()
        .patch('/email')
        .withBody(changeEmailDto)
        .expectStatus(200);
    });
  });

  describe('Delete', () => {
    it('should delete user', () => {
      return pactum
        .spec()
        .delete('/')
        .withBody({
          password: testProperties.newPassword,
        })
        .expectStatus(200);
    });
  });
});

// describe('Users Error Handling', () => {
//   const nonExistentUserBasePath = `/users/nonexistentuser`;

//   describe('Password', () => {
//     it('should not change password with incorrect current password', async () => {
//       const incorrectPasswordDto = {
//         password: 'incorrectPassword',
//         newPassword: testProperties.newPassword,
//       };

//       return pactum
//         .spec()
//         .patch(`${usersBasePath}/password`)
//         .withBody(incorrectPasswordDto)
//         .expectStatus(401);
//     });

//     it('should not change password for non-existent user', async () => {
//       const changePasswordDto = {
//         password: testProperties.defaultTestUser.password,
//         newPassword: testProperties.newPassword,
//       };

//       return pactum
//         .spec()
//         .patch(`${nonExistentUserBasePath}/password`)
//         .withBody(changePasswordDto)
//         .expectStatus(401);
//     });
//   });

//   describe('Nickname', () => {
//     it('should not change nickname with incorrect password', () => {
//       const incorrectPasswordDto = {
//         newNickname: 'vlad',
//         password: 'incorrectPassword',
//       };

//       return pactum
//         .spec()
//         .patch(`${usersBasePath}/nickname`)
//         .withBody(incorrectPasswordDto)
//         .expectStatus(401);
//     });

//     it('should not change nickname for non-existent user', () => {
//       const changeNicknameDto = {
//         newNickname: 'vlad',
//         password: testProperties.newPassword,
//       };

//       return pactum
//         .spec()
//         .patch(`${nonExistentUserBasePath}/nickname`)
//         .withBody(changeNicknameDto)
//         .expectStatus(401);
//     });
//   });

//   describe('Email', () => {
//     it('should not change email with incorrect password', () => {
//       const incorrectPasswordDto = {
//         newEmail: `2${defaultTestUser.email}}`,
//         password: 'incorrectPassword',
//       };

//       return pactum
//         .spec()
//         .patch(`${usersBasePath}/email`)
//         .withBody(incorrectPasswordDto)
//         .expectStatus(401);
//     });

//     it('should not change email for non-existent user', () => {
//       const changeEmailDto = {
//         newEmail: `2${defaultTestUser.email}}`,
//         password: testProperties.newPassword,
//       };

//       return pactum
//         .spec()
//         .patch(`${nonExistentUserBasePath}/email`)
//         .withBody(changeEmailDto)
//         .expectStatus(401);
//     });
//   });

//   describe('Delete', () => {
//     it('should not delete user with incorrect password', () => {
//       return pactum
//         .spec()
//         .delete(usersBasePath)
//         .withBody({
//           password: 'incorrectPassword',
//         })
//         .expectStatus(401);
//     });

//     it('should not delete non-existent user', () => {
//       return pactum
//         .spec()
//         .delete(nonExistentUserBasePath)
//         .withBody({
//           password: testProperties.newPassword,
//         })
//         .expectStatus(401);
//     });
//   });
// });