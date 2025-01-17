import { FieldValue } from '@google-cloud/firestore';
import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Message } from 'src/models/message.model';
import { MessageResponse } from 'src/models/response/message_response.model';


// TODO: create db interface
@Injectable()
export class FirestoreService implements OnModuleInit{
    private database: admin.firestore.Firestore;
    private readonly logger = new Logger(FirestoreService.name);
    
    constructor() {}

    async onModuleInit() {
        try {
            this.logger.log(`Attempting connection to Firestore for database operations`);
            this.database = admin.firestore();

            this.logger.log('Firebase Firestore connection established');
        } catch (error) {
            this.logger.error(`Error initializing Firebase: ${error}`);
        }
    }
    
    async createUser(collection: string, mail: string) : Promise<void> {
        this.logger.log(`Creating document for user with mail: ${mail}`);
        const userRef = this.database.collection(collection);
        userRef.add({mail: mail});
        this.logger.log(`Document created succesfully`);
    }

    async getDocumentList(collection: string, mail: string) : Promise<Array<any> > {
        const userRef = this.database.collection(collection);
        const query = userRef.where('mail', '==', mail);
        let snapshot = await query.get();
        let documentList : Array<any> = [];
        snapshot.forEach(doc => {
            documentList.push(doc);
        });
        return documentList;    
    }

    async getMessageList(userDocId : string, beforeTimestamp : FieldValue) : Promise<Array<MessageResponse> > {
        this.logger.log('Getting message list');
        let query = await this.database.collection('user')
                        .doc(userDocId)
                        .collection('messages')
                        .where('timestamp', '<', beforeTimestamp)
                        .orderBy('timestamp', 'desc')
                        .limit(20)
                        .get();

        this.logger.log(`Found ${query.docs.length} messages for ${userDocId}`);
        let chatList : Array<MessageResponse> = [];
        query.docs.forEach(doc => {
            chatList.push({
                message: doc.data().message,
                isAI: doc.data().isAI,
                timestamp: doc.data().timestamp.toDate().toISOString()
            });
        });
        return chatList;
    }

    async readUserChat(mail: string, beforeTimestamp : FieldValue) : Promise<Array<MessageResponse> | null>{
        let documentList = await this.getDocumentList('user', mail);
        if(documentList.length === 0) {
            this.logger.log(`User with mail: ${mail} not found, returning null`);
            return null;
        } else {
            this.logger.log(`User with mail: ${mail} found`);
            let userDocId : any = null;
            documentList.forEach((doc) => {
                userDocId = doc.id;
            });
            
            this.logger.log('Getting chat');
            let chat : Array<MessageResponse> = await this.getMessageList(userDocId, beforeTimestamp);
            return chat;
        }
    }

    async addMessage(mail: string, message: Message) : Promise<void> {
        this.logger.log('Getting document id');
        let documentList = await this.getDocumentList('user', mail);
        if(documentList.length === 0) {
            this.logger.log(`User with mail: ${mail} not found`);
            throw new NotFoundException('User not found');
        }
        let documentId = documentList[0].id;

        this.logger.log(`Document id found ${documentId}, inserting new message`);
        await this.database.collection('user').doc(documentId).collection('messages').add(message);
    }

}
