import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatController } from './controllers/chat/chat.controller';
import { ChatService } from './services/chat/chat.service';
import { OpenAiService } from './services/open_ai/open_ai.service';
import { ConfigModule } from '@nestjs/config';
import { InterfaceChatService } from './services/interfaces/interface_chat.service';
import { FirestoreService } from './services/firestore/firestore.service';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  })],
  controllers: [AppController, ChatController],
  providers: [AppService,
  {
    provide: "ChatService",
    useClass: ChatService,
  },
  {
    provide: "GenerativeAIService",
    useClass: OpenAiService
  },
  {
    provide: "CloudDB",
    useClass: FirestoreService
  }],
})
export class AppModule {}
