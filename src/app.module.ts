import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { ChatController } from './chat/chat.controller';

@Module({
  imports: [],
  controllers: [AppController, AuthController, ChatController],
  providers: [AppService],
})
export class AppModule {}
