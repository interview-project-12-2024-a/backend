import { OpenAIMessage } from "./open_ai_message.model";

export class OpenAIChoice {
    index?: number;
    message: OpenAIMessage;
    finish_reason?: string;
}