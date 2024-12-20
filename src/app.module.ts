import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './controllers/auth/auth.controller';
import { ChatController } from './controllers/chat/chat.controller';
import { ChatService } from './services/chat/chat.service';
import { AuthService } from './services/auth/auth.service';
import { OpenAiService } from './services/open_ai/open_ai.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, AuthController, ChatController],
  providers: [AppService, ChatService, AuthService, OpenAiService],
})
export class AppModule {}
