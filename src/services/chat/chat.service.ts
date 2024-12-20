import { Inject, Injectable, Logger } from '@nestjs/common';
import { InterfaceChatService } from '../interfaces/interface_chat.service';
import { Message } from 'src/models/message.model';
import { InterfaceGenerativeIAService } from '../interfaces/interface_generative_ia.service';
import { OpenAICompleteResponse } from 'src/models/response/open_ai_complete_response.model';
import { OpenAiService } from '../open_ai/open_ai.service';

@Injectable()
export class ChatService implements InterfaceChatService{
    private readonly logger = new Logger(ChatService.name);
    
    constructor(@Inject("GenerativeAIService") private generativeAIService: InterfaceGenerativeIAService) {}

    getChat(): Array<Message> {
        // TODO: implement connection to firebase
        this.logger.log('Getting chat from firebase');
        let res = Array<Message>();
        res.push({message: 'Is my dog cute?', timestamp: new Date(), isAI: false});
        res.push({message: 'Yes it is', timestamp: new Date(), isAI: true});

        this.logger.log(`Found ${res.length} messages for GET /chat`);
        return res;
    }

    async sendPrompt(message: Message): Promise<Message> {
        let openAIResponse : OpenAICompleteResponse = await this.generativeAIService.complete(message);
        
        this.logger.log('Checking if openAI sent valid response');
        if(openAIResponse.choices.length == 0) {
            this.logger.log('OpenAI did not sent valid response, returning error');
            throw "Invalid openAI response";
        }
        this.logger.log('OpenAI sent valid response');

        let res  : Message = {
            message: openAIResponse.choices[0].message.content,
            isAI: true,
            timestamp: new Date()
        };

        this.logger.log(`Returning openAI response: ${res.message}`);
        return res;
    }
}
