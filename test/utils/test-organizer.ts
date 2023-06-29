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

  async setup() {
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
    await this.app.listen(3333);

    const hash = await argon.hash(this.testProperties.defaultTestUser.password);
    this.postgresService = this.app.get(PostgresService);
    this.configService = this.app.get(ConfigService);
    this.mongoService = this.app.get(MongoService);
    this.defaultTestUser = await this.postgresService.user.create({
      data: {
        email: this.testProperties.defaultTestUser.email,
        nickname: this.testProperties.defaultTestUser.nickname,
        password: hash,
      },
    });

    pactum.request.setBaseUrl('http://localhost:3333');
    pactum.request.setDefaultHeaders({
      Authorization: this.configService.get<string>('ADMIN_TOKEN'),
    });
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
}
