import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ShortsController } from './shorts/shorts.controller';
import { ShortsService } from './shorts/shorts.service';
import { ShortsModule } from './shorts/shorts.module';

@Module({
  imports: [UserModule, ShortsModule],
  controllers: [AppController, ShortsController],
  providers: [AppService, ShortsService],
})
export class AppModule {}
