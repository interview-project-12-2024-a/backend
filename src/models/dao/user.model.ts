import { Message } from "../message.model";

export class User {
    mail: string;
    password: string;
    chat: Array<Message>;
}