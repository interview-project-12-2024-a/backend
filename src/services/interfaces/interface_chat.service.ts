import { Message } from "src/models/message.model";
import { OpenAICompleteResponse } from "src/models/response/open_ai_complete_response.model";

export interface InterfaceChatService {
    getChat(): Array<Message>;
    sendPrompt(message: Message): Promise<Message>;
}
