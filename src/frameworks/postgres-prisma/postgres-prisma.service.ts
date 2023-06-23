import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from 'prisma/prisma/postgres-client';

@Injectable()
export class PostgresService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('POSTGRES_URL'),
        },
      },
    });
  }

  cleanDb() {
    // return this.$transaction([this.user.deleteMany()]);
  }
}
