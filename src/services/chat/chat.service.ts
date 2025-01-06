import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InterfaceChatService } from '../interfaces/interface_chat.service';
import { Message } from 'src/models/message.model';
import { InterfaceGenerativeIAService } from '../interfaces/interface_generative_ia.service';
import { OpenAICompleteResponse } from 'src/models/response/open_ai_complete_response.model';
import { FirestoreService } from '../firestore/firestore.service';
import * as admin from 'firebase-admin';
import { timestamp } from 'rxjs';

@Injectable()
export class ChatService implements InterfaceChatService{
    private readonly logger = new Logger(ChatService.name);
    
    constructor(@Inject("GenerativeAIService") private generativeAIService: InterfaceGenerativeIAService,
                @Inject("CloudDB") private database: FirestoreService) {}

    async getChat(mail: string, timestamp : string): Promise<Array<Message> > {
        this.logger.log('Getting date');
        let timestampFirebase = admin.firestore.Timestamp.fromDate(new Date(timestamp));
        this.logger.log('Getting chat from firebase');
        let dbResponse = await this.database.readUser(mail, timestampFirebase);
        
        let res : Array<Message> = [];
        if(!dbResponse || dbResponse.chat === null) {
            this.logger.log(`User not found creating user with mail: ${mail}`);
            let newUser = {
                mail: mail,
            };
            this.database.createUser('user', newUser);
        }
        else {
            res = dbResponse.chat.reverse();
            this.logger.log(`Found ${res.length} messages for GET /chat`);
        }
        return res;
    }

    async sendPrompt(mail: string, message: Message): Promise<any> {
        message.timestamp = admin.firestore.FieldValue.serverTimestamp();
        this.logger.log('Sending message to openAI');
        let openAIResponse : OpenAICompleteResponse = await this.generativeAIService.complete(message);
       
        this.logger.log('Checking if openAI sent valid response');
        if(openAIResponse.choices.length == 0) {
            this.logger.log('OpenAI did not sent valid response, returning error');
            throw new InternalServerErrorException("Invalid openAI response");
        }

        this.logger.log('OpenAI sent valid response');
        this.logger.log('Saving message in firestore');
        await this.database.updateChat('user', mail, message);

        let res  : Message = {
            message: openAIResponse.choices[0].message.content,
            isAI: true,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        };

        this.logger.log('Saving openAI response to firestore');
        await this.database.updateChat('user', mail, res);
        
        // TODO: create response class
        let response = {
            message: res.message,
            isAI: true,
            timestamp : new Date(Date.now()).toISOString(),
        }

        this.logger.log(`Returning openAI response: ${res.message}`);
        return response;
    }
}
