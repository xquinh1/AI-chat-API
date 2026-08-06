import { GoogleGenAI } from "@google/genai";
import { history } from "../store/history.js";

class Service {
    constructor() {
        this.history = history
        this.ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        })
    }

    async askGemini(prompt) {
        this.history.push({
            role: "user",
            parts: [
                {
                    text: prompt
                }
            ]
        })

        try {
            const response = await this.ai.models.generateContentStream({
                model: "gemini-3.5-flash",
                contents: this.history,
            });

            let text = "";

            for await (const chunk of response) {
                text += chunk.text || "";
            }
            
            this.history.push({
                role: "model",
                parts: [
                    {
                        text: text
                    }
                ]
            });
            return text;
        } catch (err) {
            this.history.pop()
            throw err
        }

    }
}

export default Service