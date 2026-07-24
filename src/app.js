import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

const result = dotenv.config();

console.log(result);
console.log(process.env.GEMINI_API_KEY);

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

async function main() {
    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: "Explain the concept of IELTS exam",
    });

    console.log(response.text);
}

main().catch(console.error);