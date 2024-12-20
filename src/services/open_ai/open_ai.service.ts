import { Injectable, Logger } from '@nestjs/common';
import { InterfaceGenerativeIAService } from '../interfaces/interface_generative_ia.service';
import { Message } from 'src/models/message.model';
import { OpenAICompleteResponse } from 'src/models/response/open_ai_complete_response.model';
import OpenAI from 'openai';

@Injectable()
export class OpenAiService implements InterfaceGenerativeIAService {
    private readonly logger = new Logger(OpenAiService.name);

    private readonly openai = new OpenAI({
        apiKey: process.env.OPEN_AI_KEY
    });

    complete(message: Message): Promise<OpenAICompleteResponse> {
        this.logger.log(`Sending prompt to openAI with message: ${message.message}`);
        return this.openai.chat.completions.create({
            model: process.env.OPEN_AI_MODEL,
            store: true,
            messages: [
                {"role": "user", "content": message.message},
            ],
        });
    }

}
