import { Message } from "../message.model";

export class GetChatResponse {
    chat: Array<Message>;
    nextPageTimestamp?: string;
}