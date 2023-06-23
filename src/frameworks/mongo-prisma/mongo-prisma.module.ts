import { Global, Module } from '@nestjs/common';
import { MongoService } from './mongo-prisma.service';

@Global()
@Module({
  providers: [MongoService],
  exports: [MongoService],
})
export class MongoPrismaModule {}
