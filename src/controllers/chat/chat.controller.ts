import { Body, Controller, Get, Inject, Post, Request, UseGuards } from '@nestjs/common';
import { Message } from 'src/models/message.model';
import { InterfaceChatService } from 'src/services/interfaces/interface_chat.service';
import { FirebaseAuthGuard } from 'src/shared/guards/firebase_auth/firebase_auth.guard';

// TODO: implement guard for this controller
@Controller('chat')
export class ChatController {
    constructor(@Inject("ChatService") private chatService: InterfaceChatService) {}

    @Get()
    @UseGuards(FirebaseAuthGuard)
    getChat(@Request() req): Promise<Array<Message>> {
        return this.chatService.getChat(req.user.email);
    }

    @Post()
    @UseGuards(FirebaseAuthGuard)
    sendPrompt(@Request() req, @Body() message: Message) {
        return this.chatService.sendPrompt(req.user.email, message);
    }
    
}
