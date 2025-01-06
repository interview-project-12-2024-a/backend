import { FieldValue } from "@google-cloud/firestore";

export class Message {
    message: string;
    timestamp?: FieldValue;
    isAI: boolean;
}