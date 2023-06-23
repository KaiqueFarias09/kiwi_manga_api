import { Global, Module } from '@nestjs/common';
import { MongoService } from './prisma.service';

@Global()
@Module({
  providers: [MongoService],
  exports: [MongoService],
})
export class PrismaModule {}
