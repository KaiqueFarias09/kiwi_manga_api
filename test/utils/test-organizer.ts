// testSetup.ts
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import * as argon from 'argon2';
import helmet from 'helmet';
import * as pactum from 'pactum';
import { User } from '../../prisma/prisma/postgres-client';
import { AppModule } from '../../src/app.module';
import { MongoService } from '../../src/frameworks/mongo-prisma/mongo-prisma.service';
import { PostgresService } from '../../src/frameworks/postgres-prisma/postgres-prisma.service';
import { TestProperties } from './test-properties';

export class TestSetup {
  private app: INestApplication;
  private postgresService: PostgresService;
  private configService: ConfigService;
  private mongoService: MongoService;
  private defaultTestUser: User;
  private testProperties = new TestProperties();

  async setup({
    shouldCreateDefaults = true,
  }: {
    shouldCreateDefaults: boolean;
  }) {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    this.app = moduleRef.createNestApplication();
    this.app.use(helmet());
    this.app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await this.app.init();
    await this.app.listen(0);
    const baseUrl = `http://localhost:${
      this.app.getHttpServer().address().port
    }`;

    this.postgresService = this.app.get(PostgresService);
    this.configService = this.app.get(ConfigService);
    this.mongoService = this.app.get(MongoService);

    if (shouldCreateDefaults) {
      const randomValue = Math.floor(Math.random() * 1000000);
      const jwtToken = await this.getJwtToken(baseUrl, randomValue);
      this.defaultTestUser = await this.postgresService.user.findUnique({
        where: {
          email: randomValue + this.testProperties.defaultTestUser.email,
        },
      });

      pactum.request.setBaseUrl(baseUrl);
      pactum.request.setDefaultHeaders({
        'X-API-Key': this.configService.get<string>('ADMIN_TOKEN'),
        Authorization: `Bearer ${jwtToken}`,
      });
    }
  }

  async teardown(testHasDeleteUserMethod?: boolean) {
    await this.app.close();
    if (!testHasDeleteUserMethod) {
      await this.postgresService.user.delete({
        where: { id: this.defaultTestUser.id },
      });
    }
  }

  getServices() {
    return {
      app: this.app,
      postgresService: this.postgresService,
      configService: this.configService,
      mongoService: this.mongoService,
      defaultTestUser: this.defaultTestUser,
    };
  }

  private async getJwtToken(baseUrl: string, randomValue: number) {
    const hash = await argon.hash(this.testProperties.defaultTestUser.password);
    const response = await fetch(`${baseUrl}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.configService.get<string>('ADMIN_TOKEN'),
      },
      body: JSON.stringify({
        email: randomValue + this.testProperties.defaultTestUser.email,
        nickname: this.testProperties.defaultTestUser.nickname,
        password: hash,
      }),
    });

    const responseData = await response.json();
    return responseData.data.access_token;
  }
}
