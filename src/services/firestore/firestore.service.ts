import { FieldValue } from '@google-cloud/firestore';
import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { NotFoundError } from 'rxjs';
import { Message } from 'src/models/message.model';
import { User } from 'src/models/user.model';


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
    
    async createUser(collection: string, user: any) : Promise<void> {
        this.logger.log(`Creating document for user with mail: ${user.mail}`);
        const userRef = this.database.collection(collection);
        userRef.add(user);
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

    async getChatList(docId : string, timestamp : FieldValue) : Promise<any> {
        this.logger.log('Getting message list');
        let snapshot = await this.database.collection('user')
                        .doc(docId)
                        .collection('messages')
                        .where('timestamp', '<', timestamp)
                        .orderBy('timestamp', 'desc')
                        .limit(20)
                        .get();

        this.logger.log(`Found ${snapshot.docs.length} messages for ${docId}`);
        let chatList : Array<any> = [];
        snapshot.docs.forEach(doc => {
            chatList.push({
                message: doc.data().message,
                isAI: doc.data().isAI,
                timestamp: doc.data().timestamp.toDate().toISOString()
            });
        });
        return chatList;
    }

    async readUser(mail: string, timestamp : FieldValue) : Promise<any>{
        let documentList = await this.getDocumentList('user', mail);
        if(documentList.length === 0) {
            this.logger.log(`User with mail: ${mail} not found`);
        } else {
            this.logger.log(`User with mail: ${mail} found`);
            let user : any = null;
            documentList.forEach((doc) => {
                user = {
                    mail: doc.data().mail,
                    docId: doc.id,
                    chat: [],
                };
            });
            
            this.logger.log('Getting chat');
            user.chat = await this.getChatList(user.docId, timestamp);

            return user;
        }
    }

    async updateChat(collection: string, mail: string, message: Message) : Promise<void> {
        this.logger.log('Getting document id');
        let documentList = await this.getDocumentList(collection, mail);
        if(documentList.length === 0) {
            this.logger.log(`User with mail: ${mail} not found`);
            throw new NotFoundException('User not found');
        }
        let documentId = documentList[0].id;

        this.logger.log(`Document id found ${documentId}, inserting new message`);
        await this.database.collection(collection).doc(documentId).collection('messages').add(message);
    }

}
