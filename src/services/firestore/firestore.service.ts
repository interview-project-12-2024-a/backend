import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import { Message } from 'src/models/message.model';
import { User } from 'src/models/dao/user.model';


// TODO: create db interface
@Injectable()
export class FirestoreService implements OnModuleInit{
    private database: admin.firestore.Firestore;
    private readonly logger = new Logger(FirestoreService.name);
    
    constructor() {}

    async onModuleInit() {
        try {
            this.logger.log('Getting Firebase config file');
            const accountPath = process.env.FIREBASE_KEY;
            const serviceAccount = JSON.parse(fs.readFileSync(accountPath, 'utf8'));
            
            this.logger.log(`Attempting connection to Firestore, with project: ${serviceAccount.project_id}`);
            this.database = admin.firestore();

            this.logger.log('Firebase Firestore connection established');
        } catch (error) {
            this.logger.error(`Error initializing Firebase: ${error}`);
        }
    }
    
    async create(collection: string, user: User) : Promise<void> {
        this.logger.log(`Creating document for user with mail: ${user.mail}`);
        const userRef = this.database.collection(collection);
        // await userRef.set(user);
        this.logger.log(`Document created succesfully`);
    }

    async getDocument(collection: string, mail: string) : Promise<any> {
        const userRef = this.database.collection(collection);
        const query = userRef.where('mail', '==', 'moises.quispe.arellano@gmail.com');
        return query.get();        
    }

    async readUser(mail: string) : Promise<any>{
        let snapshot = await this.getDocument('user', mail);
        console.log(snapshot);
        if(snapshot.empty) {
            this.logger.log(`Request for user with mail: ${mail} does not have entries`);
        } else {
            this.logger.log(`Request for user with mail: ${mail} found`);
            let user : User;
            snapshot.forEach(doc => {
                user = {
                    mail: doc.data().mail,
                    password: doc.data().password,
                    chat: doc.data().chat
                };
            });
            return user;
        }
    }

    async update(collection: string, mail: string, message: Message) : Promise<void> {
        let snapshot = await this.getDocument(collection, mail);
        let documentId = snapshot.id;
        //implement update function
        console.log(snapshot);
    }

}
