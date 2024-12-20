import { Message } from "src/models/message.model";

export interface InterfaceGenerativeIAService {
    complete(message: Message): any;
}
