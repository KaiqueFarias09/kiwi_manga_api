import { Global, Module } from '@nestjs/common';
import { PostgresService } from './postgres-prisma.service';

@Global()
@Module({
  providers: [PostgresService],
  exports: [PostgresService],
})
export class PostgresPrismaModule {}
