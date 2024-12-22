import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { Message } from 'src/models/message.model';
import { InterfaceChatService } from 'src/services/interfaces/interface_chat.service';

// TODO: implement guard for this controller
@Controller('chat')
export class ChatController {
    constructor(@Inject("ChatService") private chatService: InterfaceChatService) {}

    @Get()
    getChat(): Promise<Array<Message>> {
        // TODO: get mail from firebase token
        return this.chatService.getChat('moises.quispe.arellano@gmail.com');
    }

    @Post()
    sendPrompt(@Body() message: Message) {
        // TODO: get mail from firebase token
        return this.chatService.sendPrompt('moises.quispe.arellano@gmail.com', message);
    }
    
}
