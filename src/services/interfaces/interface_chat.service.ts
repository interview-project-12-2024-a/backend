import { Message } from "src/models/message.model";
import { GetChatResponse } from "src/models/response/get_chat_response.model";

export interface InterfaceChatService {
    getChat(mail: string, timestamp?: string): Promise<GetChatResponse>;
    sendPrompt(mail: string, message: Message): Promise<any>;
}
