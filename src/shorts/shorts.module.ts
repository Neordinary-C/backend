import { Module } from '@nestjs/common';
import { ShortsService } from './shorts.service';
import { ShortsController } from './shorts.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
  providers: [ShortsService, DatabaseService],
  controllers: [ShortsController],
})
export class ShortsModule {}
