import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from 'prisma/prisma/mongo-client';

@Injectable()
export class MongoService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('MONGODB_URL'),
        },
      },
    });
  }

  cleanDb() {
    // return this.$transaction([this.user.deleteMany()]);
  }
}
