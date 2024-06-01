import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ShortsModule } from './shorts/shorts.module';

@Module({
  imports: [UserModule, ShortsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
