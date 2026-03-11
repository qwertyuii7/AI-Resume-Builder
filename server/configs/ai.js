import OpenAI from "openai";

const ai = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: process.env.OPEN_AI_BASE_URL,
    timeout: 12000,
    maxRetries: 1
});

export default ai;