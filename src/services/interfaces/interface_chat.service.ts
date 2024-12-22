import { Message } from "src/models/message.model";
import { OpenAICompleteResponse } from "src/models/response/open_ai_complete_response.model";

export interface InterfaceChatService {
    getChat(mail: string): Promise<Array<Message> >;
    sendPrompt(mail: string, message: Message): Promise<Message>;
}
