import { Controller, Get, Post } from '@nestjs/common';
import { Message } from 'src/models/message.model';
import { ChatService } from 'src/services/chat/chat.service';

// TODO: implement guard for this controller
@Controller('chat')
export class ChatController {
    constructor(private chatService: ChatService) {}

    @Get()
    getChat(): Array<Message> {
        return this.chatService.getChat();
    }

    @Post()
    sendPrompt(message: Message) {
        return this.chatService.sendPrompt(message);
    }
    
}
