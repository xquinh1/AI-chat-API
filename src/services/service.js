import { GoogleGenAI } from "@google/genai";

class Service {
    constructor() {
        this.ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        })
    }

    async askGemini(prompt) {
        const response = await this.ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt,
        });
        return response.text;
    }
}

export default Service