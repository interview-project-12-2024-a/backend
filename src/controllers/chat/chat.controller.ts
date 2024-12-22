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
        // TODO: get mail from firebase token
        console.log(req);
        return this.chatService.getChat('moises.quispe.arellano@gmail.com');
    }

    @Post()
    @UseGuards(FirebaseAuthGuard)
    sendPrompt(@Request() req, @Body() message: Message) {
        // TODO: get mail from firebase token
        console.log(req);
        return this.chatService.sendPrompt('moises.quispe.arellano@gmail.com', message);
    }
    
}
