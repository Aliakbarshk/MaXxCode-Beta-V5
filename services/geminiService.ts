import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { AppLanguage } from "../types";

// Removed hardcoded/process.env check here to support dynamic user keys better
let ai: GoogleGenAI | null = null;

const initAI = (key: string) => {
  if (!ai && key) {
    try {
      ai = new GoogleGenAI({ apiKey: key });
    } catch (error) {
      console.error("Failed to initialize AI client", error);
    }
  }
};

export const getGeminiHelp = async (
  code: string,
  question: string,
  lessonContext: string,
  appLanguage: AppLanguage,
  apiKey: string | null
): Promise<string> => {
  if (!apiKey) {
    return "Please enter your API Key in Settings or unlock Developer Mode to use the AI Assistant.";
  }

  // Re-init if needed or if key changed (simple check)
  initAI(apiKey);

  if (!ai) {
    return "Connection error. Invalid API Key configuration.";
  }

  const model = "gemini-2.5-flash"; // Fast and good for chat

  let langInstruction = "Respond in English.";
  if (appLanguage === "hi")
    langInstruction = "Respond in Hindi (Devanagari script).";
  if (appLanguage === "hinglish")
    langInstruction =
      "Respond in Hinglish (Hindi mixed with English using Latin script).";

  const systemPrompt = `
    You are Max, a super energetic, encouraging coding tutor.

    CRITICAL IDENTITY INSTRUCTIONS:
    1. You were developed by Sheikh Ali Akbar.
    2. If asked "who made you", "who developed you", or similar, you MUST answer: "I was developed by Sheikh Ali Akbar."
    3. Do NOT say you were created by Google. You are MaXxCode's AI.
    
    LANGUAGE INSTRUCTION: ${langInstruction}
    
    LESSON CONTEXT:
    ${lessonContext}
    
    STUDENT CODE:
    ${code}
    
    USER QUESTION:
    ${question}
    
    RULES:
    1. Be concise (max 2-3 sentences).
    2. Use emojis 🌟.
    3. Do NOT give the solution code unless explicitly asked. Give hints.
    4. Tone: Playful, supportive.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: [
        {
          role: "user",
          parts: [{ text: systemPrompt }],
        },
      ],
    });

    return response.text || "Keep trying! You got this!";
  } catch (error) {
    console.error("AI API Error:", error);
    return "Brain freeze! Check your API Key or try again later.";
  }
};
