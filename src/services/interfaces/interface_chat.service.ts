import { Message } from "src/models/message.model";

export interface InterfaceChatService {
    getChat(): Array<Message>;
    sendPrompt(message: Message): void;
}
