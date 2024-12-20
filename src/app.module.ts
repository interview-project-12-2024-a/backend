import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './controllers/auth/auth.controller';
import { ChatController } from './controllers/chat/chat.controller';
import { ChatService } from './services/chat/chat.service';
import { AuthService } from './services/auth/auth.service';
import { OpenAiService } from './services/open_ai/open_ai.service';
import { ConfigModule } from '@nestjs/config';
import { InterfaceChatService } from './services/interfaces/interface_chat.service';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  })],
  controllers: [AppController, AuthController, ChatController],
  providers: [AppService,
  {
    provide: "ChatService",
    useClass: ChatService,
  },
  {
    provide: "AuthService",
    useClass: AuthService, 
  },
  {
    provide: "GenerativeAIService",
    useClass: OpenAiService
  }],
})
export class AppModule {}
