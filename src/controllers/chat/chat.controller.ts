import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { Message } from 'src/models/message.model';
import { InterfaceChatService } from 'src/services/interfaces/interface_chat.service';

// TODO: implement guard for this controller
@Controller('chat')
export class ChatController {
    constructor(@Inject("ChatService") private chatService: InterfaceChatService) {}

    @Get()
    getChat(): Array<Message> {
        return this.chatService.getChat();
    }

    @Post()
    sendPrompt(@Body() message: Message) {
        return this.chatService.sendPrompt(message);
    }
    
}
