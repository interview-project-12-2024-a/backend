import { Body, Controller, Get, Inject, Post, Query, Request, UseGuards } from '@nestjs/common';
import { Message } from 'src/models/message.model';
import { InterfaceChatService } from 'src/services/interfaces/interface_chat.service';
import { FirebaseAuthGuard } from 'src/shared/guards/firebase_auth/firebase_auth.guard';

@Controller('chat')
export class ChatController {
    constructor(@Inject("ChatService") private chatService: InterfaceChatService) {}

    @Get()
    @UseGuards(FirebaseAuthGuard)
    getChat(@Request() req, 
            @Query('timestamp') lastTimestamp?: string): Promise<Array<Message>> {
        // TODO: move this to service
        let date : Date;
        if(!lastTimestamp) {
            lastTimestamp = new Date(Date.now()).toString();
        }
        
        return this.chatService.getChat(req.user.email, lastTimestamp);
    }

    @Post()
    // @UseGuards(FirebaseAuthGuard)
    sendPrompt(@Request() req, @Body() message: Message) {
        return this.chatService.sendPrompt('moises.quispe.arellano@gmail.com', message);
    }
    
}
