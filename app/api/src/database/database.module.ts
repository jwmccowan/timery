import { Module } from '@nestjs/common';
import { postgresProvider } from './postgres.provider';

@Module({
  imports: [postgresProvider],
  exports: [postgresProvider],
})
export class DatabaseModule {}
