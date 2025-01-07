import { MessageResponse } from "./message_response.model";

export class GetChatResponse {
    chat: Array<MessageResponse>;
    nextPageTimestamp?: string;
}