import { OpenAIChoice } from "../open_ai_choice.model";

export class OpenAICompleteResponse {
    id: string;
    object: string;
    created: number;
    model: string;
    usage?: any;
    choices: Array<OpenAIChoice>;
}