import { Injectable, Logger } from '@nestjs/common';
import { InterfaceChatService } from '../interfaces/interface_chat.service';
import { Message } from 'src/models/message.model';

@Injectable()
export class ChatService implements InterfaceChatService{
    private readonly logger = new Logger(ChatService.name);
    
    getChat(): Array<Message> {
        // TODO: implement connection to firebase
        this.logger.log('Getting chat from firebase');
        let res = Array<Message>();
        res.push({message: 'Is my dog cute?', timestamp: new Date(), isAI: false});
        res.push({message: 'Yes it is', timestamp: new Date(), isAI: true});

        this.logger.log(`Found ${res.length} messages for GET /chat`);
        return res;
    }

    sendPrompt(message: Message): void {
        // TODO: implement call to openAI
        this.logger.log(`Sending prompt to openAI`);
    }
}
